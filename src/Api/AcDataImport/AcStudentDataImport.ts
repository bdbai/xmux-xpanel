import AcDataImport from "./AcDataImport"
import { serverUrl } from "../Auth"

export default class AcStudentDataImport extends AcDataImport {
  protected getWsPath = () => (serverUrl + '/v2/admin/ac/import/students').replace('http', 'ws')
}
