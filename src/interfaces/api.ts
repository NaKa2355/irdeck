import { type Button } from '../type/button'
import { type Device } from '../type/device.type'
import { type IrData } from '../type/irdata.type'
import { type Remote } from '../type/remote'
import { type Result } from '../type/result'

export type ErrorCode =
'success' |
'remote_name_already_exists' |
'remote_not_found' |
'button_not_found' |
'devices_can_send_not_found' |
'devices_can_receive_not_found' |
'device_busy' |
'device_not_found' |
'timeout' |
'unknown'

export interface ReceiveIrReq {
  deviceId: string
}

export interface PushButtonReq {
  remoteId: string
  buttonId: string
  deviceId: string
}

export interface AddRemoteReq {
  remoteName: string
  deviceId: string
  tag: string
  buttons: Array<{
    buttonName: string
    tag: string
  }>
}

export interface EditRemoteReq {
  remoteId: string
  remoteName: string
  deviceId: string
}

export interface DeleteRemoteReq {
  remoteId: string
}

export interface GetButtonsReq {
  remoteId: string
}

export class ApiError extends Error {
  code: ErrorCode

  constructor (code: ErrorCode, message: string) {
    super(message, undefined)
    this.code = code
  }
}

export const success = new ApiError('success', '')

export interface SetIrDataReq {
  remoteId: string
  buttonId: string
  irData: IrData
}

export interface SendIrReq {
  irData: IrData
  deviceId: string
}

export interface IApi {
  getDevices: () => Promise<Result<Device[], ApiError>>
  receiveIr: (req: ReceiveIrReq) => Promise<Result<IrData, ApiError>>
  pushButton: (req: PushButtonReq) => Promise<Result<void, ApiError>>
  sendIr: (req: SendIrReq) => Promise<Result<void, ApiError>>
  setIrData: (req: SetIrDataReq) => Promise<Result<void, ApiError>>
  getRemotes: () => Promise<Result<Remote[], ApiError>>
  addRemote: (req: AddRemoteReq) => Promise<Result<Remote, ApiError>>
  editRemotes: (req: EditRemoteReq) => Promise<Result<void, ApiError>>
  deleteRemotes: (req: DeleteRemoteReq) => Promise<Result<void, ApiError>>
  getButtons: (req: GetButtonsReq) => Promise<Result<Button[], ApiError>>
}
