import { type AddRemotesReq, ApiError, type DeleteRemotesReq, type EditRemotesReq, type ErrorCode, type GetButtonsReq, type IApi, type ReceiveIrReq, type SendIrReq, type SetIrDataReq, type PushButtonReq } from '../interfaces/api'
import { type Device } from '../type/device.type'
import { type Result } from '../type/result'
import * as pirem from 'irdeck-proto/gen/js/pirem/api/v1/irdata_pb'
import { PiRemServiceClient } from 'irdeck-proto/gen/js/pirem/api/v1/pirem_service_grpc_web_pb'
import { AimServiceClient } from 'irdeck-proto/gen/js/aim/api/v1/aim_service_grpc_web_pb'
import { GetAllDeviceInfoRequest, ReceiveIrRequest, SendIrRequest } from 'irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb'
import { type IrData } from '../type/irdata.type'
import { AddRemoteRequest, DeleteRemoteRequest, EditRemoteRequest, GetButtonsRequest, GetIrDataRequest, SetIRDataRequest } from 'irdeck-proto/gen/js/aim/api/v1/aim_service_pb'
import { type Remote } from '../type/remote'
import { type Button } from '../type/button'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { StatusCode } from 'grpc-web'

export class Api implements IApi {
  private readonly aimClient: AimServiceClient
  private readonly piremClient: PiRemServiceClient

  constructor (url: string) {
    this.aimClient = new AimServiceClient(url)
    this.piremClient = new PiRemServiceClient(url)
  }

  private async sendIrData (irData: Uint8Array, deviceId: string): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const req = new SendIrRequest()
      req.setDeviceId(deviceId)
      req.setIrData(pirem.IrData.deserializeBinary(irData))
      let errCode: ErrorCode = 'unknown'

      this.piremClient.sendIr(req, {}, (err, _) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.NOT_FOUND:
              errCode = 'device_not_found'
              break
            case StatusCode.RESOURCE_EXHAUSTED:
              errCode = 'device_busy'
              break
            default:
              errCode = 'unknown'
              break
          }
          resolve({
            isError: true,
            error: new ApiError(errCode, err.message)
          })
          return
        }

        resolve({
          isError: false,
          data: undefined
        })
      })
    })
  }

  private async getIrData (remoteId: string, buttonId: string): Promise<Result<IrData, ApiError>> {
    return await new Promise((resolve) => {
      const req = new GetIrDataRequest()
      req.setRemoteId(remoteId)
      req.setButtonId(buttonId)
      let errCode: ErrorCode = 'unknown'

      this.aimClient.getIrData(req, {}, (err, res) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.NOT_FOUND:
              errCode = 'remote_not_found'
              break
            default:
              errCode = 'unknown'
              break
          }

          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }

        const irData = res.unpack<pirem.IrData>(pirem.IrData.deserializeBinary.bind(null), res.getTypeName())
        resolve({
          isError: false,
          data: irData?.serializeBinary() ?? new Uint8Array()
        })
      })
    })
  }

  async getDevices (): Promise<Result<Device[], ApiError>> {
    return await new Promise((resolve) => {
      this.piremClient.getAllDeviceInfo(new GetAllDeviceInfoRequest(), {}, (err, res) => {
        if (err.code !== StatusCode.OK) {
          resolve({
            isError: true,
            error: new ApiError(
              'unknown',
              err.message
            )
          })
          return
        }

        const devices = res.getDeviceInfoList().map((dev) => {
          return {
            id: dev.getId(),
            name: dev.getName(),
            canSend: dev.getCanSend(),
            canReceive: dev.getCanReceive(),
            bufferSize: dev.getBufferSize(),
            driverVersion: dev.getDriverVersion(),
            firmwareVersion: dev.getFirmwareVersion()
          }
        })

        resolve({
          isError: false,
          data: devices
        })
      })
    })
  }

  async receiveIr (req: ReceiveIrReq): Promise<Result<Uint8Array, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new ReceiveIrRequest()
      let errCode: ErrorCode

      apiReq.setDeviceId(req.deviceId)
      this.piremClient.receiveIr(apiReq, {}, (err, res) => {
        switch (err.code) {
          case StatusCode.DEADLINE_EXCEEDED:
            errCode = 'timeout'
            break
          case StatusCode.RESOURCE_EXHAUSTED:
            errCode = 'device_busy'
            break
          default:
            errCode = 'unknown'
            break
        }

        if (err.code !== StatusCode.OK) {
          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }

        resolve({
          isError: false,
          data: res.getIrData()?.serializeBinary() ?? new Uint8Array()
        })
      })
    })
  }

  async pushButton (req: PushButtonReq): Promise<Result<void, ApiError>> {
    const pushButton = async (): Promise<Result<void, ApiError>> => {
      const irDataResult = await this.getIrData(req.remoteId, req.buttonId)
      if (irDataResult.isError) {
        return irDataResult
      }
      return await this.sendIrData(irDataResult.data, req.deviceId)
    }
    return await pushButton()
  }

  async sendIr (req: SendIrReq): Promise<Result<void, ApiError>> {
    return await this.sendIrData(req.irData, req.deviceId)
  }

  async setIrData (req: SetIrDataReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new SetIRDataRequest()
      const any = new Any()
      let errCode: ErrorCode = 'unknown'

      any.pack(req.irData, 'IrData')

      apiReq.setRemoteId(req.remoteId)
      apiReq.setButtonId(req.buttonId)
      apiReq.setIrdata(any)

      this.aimClient.setIrData(apiReq, {}, (err, _) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.NOT_FOUND:
              errCode = 'remote_not_found'
              break
            default:
              errCode = 'unknown'
              break
          }
          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }

        resolve({
          isError: false,
          data: undefined
        })
      })
    })
  }

  async getRemotes (): Promise<Result<Remote[], ApiError>> {
    return await new Promise((resolve) => {
      this.aimClient.getRemotes(new Any(), {}, (err, res) => {
        if (err.code !== StatusCode.OK) {
          resolve({
            isError: true,
            error: new ApiError(
              'unknown',
              err.message
            )
          })
          return
        }

        const remotes = res.getRemotesList().map((remote) => {
          return {
            id: remote.getId(),
            name: remote.getName(),
            deviceId: remote.getDeviceId(),
            tag: remote.getTag()
          }
        })

        resolve({
          isError: false,
          data: remotes
        })
      })
    })
  }

  async addRemote (req: AddRemotesReq): Promise<Result<Remote, ApiError>> {
    return await new Promise((resolve) => {
      const grpcReq = new AddRemoteRequest()
      const buttonsList = new Array<AddRemoteRequest.Button>()
      let errCode: ErrorCode = 'unknown'

      for (const button of req.buttons) {
        const req = new AddRemoteRequest.Button()
        req.setName(button.buttonName)
        req.setTag(button.tag)
        buttonsList.push(req)
      }
      grpcReq.setDeviceId(req.deviceId)
      grpcReq.setName(req.remoteName)
      grpcReq.setTag(req.tag)
      grpcReq.setButtonsList(buttonsList)

      this.aimClient.addRemote(grpcReq, {}, (err, res) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.ALREADY_EXISTS:
              errCode = 'remote_name_already_exists'
              break
            default:
              errCode = 'unknown'
              break
          }
          resolve({
            isError: true,
            error: new ApiError(errCode, err.message)
          })
          return
        }

        const remoteId = res.getRemoteId()

        resolve({
          isError: false,
          data: {
            id: remoteId,
            name: req.remoteName,
            deviceId: req.deviceId,
            tag: req.tag
          }
        })
      })
    })
  }

  async editRemotes (req: EditRemotesReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new EditRemoteRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)
      apiReq.setName(req.name)
      apiReq.setDeviceId(req.deviceId)
      this.aimClient.editRemote(apiReq, {}, (err) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.ALREADY_EXISTS:
              errCode = 'remote_name_already_exists'
              break
            default:
              errCode = 'unknown'
              break
          }

          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }

        resolve({
          isError: false,
          data: undefined
        })
      })
    })
  }

  async deleteRemotes (req: DeleteRemotesReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new DeleteRemoteRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)
      this.aimClient.deleteRemote(apiReq, {}, (err) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.NOT_FOUND:
              errCode = 'remote_not_found'
              break
            default:
              break
          }
          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }
        resolve({
          isError: false,
          data: undefined
        })
      })
    })
  }

  async getButtons (req: GetButtonsReq): Promise<Result<Button[], ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new GetButtonsRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)

      this.aimClient.getButtons(apiReq, {}, (err, res) => {
        if (err.code !== StatusCode.OK) {
          switch (err.code) {
            case StatusCode.NOT_FOUND:
              errCode = 'button_not_found'
              break
            default:
              errCode = 'unknown'
              break
          }

          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
          return
        }

        const buttons = res.getButtonsList().map((button) => {
          const value: Button = {
            remoteId: req.remoteId,
            id: button.getId(),
            name: button.getName(),
            tag: button.getTag(),
            hasIrData: button.getHasIrdata()
          }
          return value
        })

        resolve({
          isError: false,
          data: buttons
        })
      })
    })
  }
}