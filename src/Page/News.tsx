import * as React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import NavTableRow from '../Component/NavTableRow'
import DeleteButton from '../Component/DeleteButton'
import { IFirebaseDataList } from '../store/IStoreState'
import MainPaper from '../Component/MainPaper'

interface IProps {
  delete: (id: string) => void
  dataList: IFirebaseDataList<'news'>
  showDraft: () => void
}

class News extends React.PureComponent<IProps> {
  private onAddButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.showDraft()
  }

  private onDelete = (id: string) => {
    this.props.delete(id)
  }

  public render () {
    const { dataList: { loading, data } } = this.props
    return <MainPaper
      loading={loading}
      title="News"
      onAdd={this.onAddButtonClick}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <TableRow /> : Object.entries(data).reverse().map(([k, v]) =>
            <NavTableRow key={k} navTo={`/news/${k}`}>
              <TableCell>{k}</TableCell>
              <TableCell>{v.data.name.lang.en_US}</TableCell>
              <TableCell><DeleteButton itemId={k} onDelete={this.onDelete} /></TableCell>
            </NavTableRow>
          )}
        </TableBody>
      </Table>
    </MainPaper>
  }
}

export default News
