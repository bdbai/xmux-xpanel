import * as Papa from 'papaparse'
import { app } from '../Auth'

export default class AcDataImport {
  protected getWsPath = () => ''
  protected beforeDataTransform: (d: any) => any = d => d
  protected afterDataTransform: (d: any) => any = d => d
  private ws: WebSocket
  private id = 0
  private pendingLeft: number
  private pendingRows: object[] = []
  private sendingItems = new Map<number, object>()
  private parser: Papa.Parser
  private parseDone = false
  private stopped = false
  constructor (
    private file: File,
    private options: {
      onData: (obj: any) => object,
      onItemError: (
        err: string,
        data: object | undefined) => void,
      onProgress: (curser: number) => void,
      onItemOk: (data: object | undefined) => void,
      onFileError: (err: Papa.ParseError) => void,
      onError: (err: string) => void,
      onComplete: () => void
    }
  ) { }

  public start = () => {
    this.ws = new WebSocket(this.getWsPath())
    this.ws.addEventListener('open', this.wsOpen)
    this.ws.addEventListener('message', this.wsMessage)
    this.ws.addEventListener('error', this.wsError)
    return this
  }

  private done = () => {
    if (this.stopped) {
      return
    }
    try {
      this.ws.close()
    } finally {
      this.ws.removeEventListener('open', this.wsOpen)
      this.ws.removeEventListener('message', this.wsMessage)
      this.ws.removeEventListener('error', this.wsError)
      this.stopped = true
    }
  }

  private sendWsMsg = (data: object) => {
    if (!this.stopped) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private wsOpen = async (e: Event) => {
    this.sendWsMsg({ token: await app.auth().currentUser!.getIdToken() })
  }

  private wsError = (e: ErrorEvent) => {
    this.options.onError(e.message)
  }

  private wsMessage = (e: MessageEvent) => {
    const res = JSON.parse(e.data as string)
    switch (res.status as 'data' | 'ok' | 'error') {
      case 'data':
        this.startTransfer(res)
        break
      case 'ok':
        this.serverAck(res.id)
        break
      case 'error':
        this.serverError(res)
        break
    }
  }

  private sendRawData = (rawData: object) => {
    const {
      sendingItems,
      sendWsMsg,
      beforeDataTransform,
      afterDataTransform,
      options: {
        onData: dataTransform
      }
    } = this
    const data = 
      afterDataTransform(
        dataTransform(
          beforeDataTransform(rawData)))
    const id = this.id++
    this.pendingLeft--
    sendingItems.set(id, data)
    sendWsMsg({ data, id })
  }

  private startTransfer = (res = { maxParallelTask: 20 }) => {
    this.pendingLeft = res.maxParallelTask || 20
    Papa.parse(this.file, {
      header: true,
      skipEmptyLines: true,
      step: (row, parser) => {
        this.parser = parser
        // row.meta.cursor
        if (row.errors.length > 0) {
          return row.errors.forEach((e, i) => this.options.onItemError(e.message, row.data[i]))
        }
        if (this.pendingLeft <= row.data.length) {
          parser.pause()
          this.pendingRows.push(...row.data.splice(this.pendingLeft))
        }
        row.data.forEach(this.sendRawData)
        this.options.onProgress((row.meta as any).cursor / this.file.size * 100)
      },
      complete: this.parseComplete,
      error: this.options.onFileError
    })
  }

  private parseComplete = () => {
    this.parseDone = true
    if (this.id === 0) {
      this.done()
      this.options.onComplete()
    }
  }

  private checkPendingItems = () => {
    if (this.pendingRows.length === 0 && this.sendingItems.size === 0) {
      if (this.parseDone) {
        this.done()
        this.options.onComplete()
      }
    } else {
      this.pendingRows
        .splice(0, this.pendingLeft)
        .forEach(this.sendRawData)
    }
  }

  private popPendingItem = (id: number) => {
    const item = this.sendingItems.get(id)
    this.sendingItems.delete(id)
    this.pendingLeft++
    if ((this.parser as any).paused()) {
      // setImmediate(() => this.parser.resume())
      this.parser.resume()
    }
    return item
  }

  private serverAck = (id: number) => {
    const item = this.popPendingItem(id)
    this.options.onItemOk(item)
    this.checkPendingItems()
  }

  private serverError = (
    res: { error: string, id: number | undefined }
  ) => {
    const { error, id } = res
    // tslint:disable-next-line:no-console
    console.error(error)
    if (id) {
      const item = this.popPendingItem(id)
      this.options.onItemError(error, item)
      this.checkPendingItems()
    } else {
      this.done()
      this.options.onError(error)
    }
  }
}
