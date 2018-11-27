export default class Factory {
  public static GetInstance<T> (name: string) {
    let ret: any
    switch (name) {
      case 'announcement':
        ret = {
          detail: {
            lang: {
              en_US: '',
              zh_CN: ''
            }
          },
          headline: {
            lang: {
              en_US: '',
              zh_CN: ''
            }
          },
          timestamp: +new Date(),
          isWebPage: true,
          uri: ''
        }
        break
      case 'news':
        ret = {
          imageURL: {
            lang: {
              en_US: '',
              zh_CN: ''
            }
          },
          name: {
            lang: {
              en_US: '',
              zh_CN: ''
            }
          },
          isWebPage: true,
          uri: ''
        }
        break
    }
    return ret as T
  }
}