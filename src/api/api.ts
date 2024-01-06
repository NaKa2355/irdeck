import { type CreateRemoteReq, ApiError, type DeleteRemoteReq, type UpdateRemoteReq, type ErrorCode, type IApi, type ReceiveIrReq, type SendIrReq, type LearnIrDataReq, type PushButtonReq, RemoteRes, FetchRemoteReq, RemotesRes } from '../interfaces/api'
import { type Device } from '../type/device.type'
import { type Result } from '../type/result'
import * as pirem from 'pirem-proto/gen/js/api/v1/irdata_pb'
import { PiRemServiceClient } from 'pirem-proto/gen/js/api/v1/pirem_service_grpc_web_pb'
import { CreateRemoteRequest, DeleteRemoteRequest, GetRemoteRequest, LearnIrDataRequest, ListDevicesRequest, ReceiveIrRequest, SendIrRequest, UpdateRemoteRequest } from 'pirem-proto/gen/js/api/v1/pirem_service_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { StatusCode } from 'grpc-web'
import { PushButtonRequest } from 'pirem-proto/gen/js/api/v1/pirem_service_pb'
import { Remote } from '../type/remote'
import { Button } from '../type/button'

interface PostButtonRequest {
  buttonName: string
  tag: string
}

export class Api implements IApi {
  private readonly piremClient: PiRemServiceClient

  constructor(url: string) {
    this.piremClient = new PiRemServiceClient(url)
  }

  private computeButtons(req: CreateRemoteReq): PostButtonRequest[] {
    const type = req.remoteType
    const buttons = new Array<PostButtonRequest>()
    if (type === 'button') {
      buttons.push({
        buttonName: 'push',
        tag: type
      })
    } else if (type === 'toggle') {
      buttons.push({
        buttonName: 'on',
        tag: type
      })
      buttons.push({
        buttonName: 'off',
        tag: type
      })
    } else if (type === 'thermostat') {
      const coolTempRange = req.coolTempRange
      const heatTempRange = req.heatTempRange
      const scale = req.scale
      buttons.push({
        buttonName: 'off',
        tag: type
      })
      for (let temp = coolTempRange[0]; temp <= coolTempRange[1]; temp += scale) {
        buttons.push({
          buttonName: 'h' + temp.toFixed(1).toString(),
          tag: type
        })
      }
      for (let temp = heatTempRange[0]; temp <= heatTempRange[1]; temp += scale) {
        buttons.push({
          buttonName: 'h' + temp.toFixed(1).toString(),
          tag: type
        })
      }
    }
    return buttons
  }

  private async sendIrData(irData: Uint8Array, deviceId: string): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const req = new SendIrRequest()
      req.setDeviceId(deviceId)
      req.setIrData(pirem.IrData.deserializeBinary(irData))
      let errCode: ErrorCode = 'unknown'

      this.piremClient.sendIr(req, {}, (err, _) => {
        if (err !== null) {
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

  async fetchDevices(): Promise<Result<Device[], ApiError>> {
    return await new Promise((resolve) => {
      this.piremClient.listDevices(new ListDevicesRequest(), {}, (err, res) => {
        if (err !== null) {
          resolve({
            isError: true,
            error: new ApiError(
              'unknown',
              err.message
            )
          })
          return
        }

        const devices = res.getDevicesList().map((dev) => {
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

  async receiveIr(req: ReceiveIrReq): Promise<Result<Uint8Array, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new ReceiveIrRequest()
      let errCode: ErrorCode

      apiReq.setDeviceId(req.deviceId)
      this.piremClient.receiveIr(apiReq, {}, (err, res) => {
        if (err === null) {
          resolve({
            isError: false,
            data: res.serializeBinary() ?? new Uint8Array()
          })
          return
        }
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

        if (err !== null) {
          resolve({
            isError: true,
            error: new ApiError(
              errCode,
              err.message
            )
          })
        }
      })
    })
  }

  async pushButton(req: PushButtonReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new PushButtonRequest()
      apiReq.setButtonId(req.buttonId)
      this.piremClient.pushButton(apiReq, {}, (err, _) => {
        if (err !== null) {
          resolve({
            isError: true,
            error: new ApiError(
              'unknown',
              err.message
            )
          })
        }
        resolve({
          isError: false,
          data: undefined
        })
      })
    })
  }

  async sendIr(req: SendIrReq): Promise<Result<void, ApiError>> {
    return await this.sendIrData(req.irData, req.deviceId)
  }

  async learnIrData(req: LearnIrDataReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new LearnIrDataRequest()
      const any = new Any()
      let errCode: ErrorCode = 'unknown'

      apiReq.setButtonId(req.buttonId)
      apiReq.setIrData(pirem.IrData.deserializeBinary(req.irData))

      this.piremClient.learnIrData(apiReq, {}, (err, _) => {
        if (err !== null) {
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

  async fetchRemotes(): Promise<Result<RemotesRes, ApiError>> {
    return await new Promise((resolve) => {
      this.piremClient.listRemotes(new Any(), {}, (err, apiRes) => {
        if (err !== null) {
          resolve({
            isError: true,
            error: new ApiError(
              'unknown',
              err.message
            )
          })
          return
        }

        const buttons: Button[] = []
        const remotes: Remote[] = apiRes.getRemotesList().map((remote) => {
          remote.getButtonsList().forEach((button) => {
            buttons.push({
              id: button.getId(),
              remoteId: remote.getId(),
              name: button.getName(),
              tag: button.getTag(),
              hasIrData: button.getHasIrData()
            })
          })

          return {
            id: remote.getId(),
            name: remote.getName(),
            tag: remote.getTag(),
            deviceId: remote.getDeviceId(),
            buttonIds: remote.getButtonsList().map((button) => button.getId())
          }
        })

        resolve({
          isError: false,
          data: {
            remotes,
            buttons
          }
        })
      })
    })
  }

  async fetchRemote(req: FetchRemoteReq): Promise<Result<RemoteRes, ApiError>> {
    return new Promise((resolve) => {
      const apiReq = new GetRemoteRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)
      this.piremClient.getRemote(apiReq, {}, (err, apiRes) => {
        if (err != null) {
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
            error: new ApiError(errCode, err.message)
          })
          return
        }


        const remote: Remote = {
          id: apiRes.getId(),
          name: apiRes.getName(),
          tag: apiRes.getTag(),
          deviceId: apiRes.getDeviceId(),
          buttonIds: apiRes.getButtonsList().map((button) => button.getId())
        }

        const buttons: Button[] = apiRes.getButtonsList().map((button) => {
          return {
            id: button.getId(),
            name: button.getName(),
            remoteId: apiRes.getId(),
            tag: button.getTag(),
            hasIrData: button.getHasIrData()
          }
        })

        resolve({
          isError: false,
          data: {
            remote,
            buttons
          },
        })
      })
    })
  }

  async createRemote(req: CreateRemoteReq): Promise<Result<RemoteRes, ApiError>> {
    return new Promise((resolve) => {
      const grpcReq = new CreateRemoteRequest()
      const buttonsList = new Array<CreateRemoteRequest.CreateButtonRequest>()
      const postButtonsReq = this.computeButtons(req)
      let errCode: ErrorCode = 'unknown'

      for (const button of postButtonsReq) {
        const req = new CreateRemoteRequest.CreateButtonRequest()
        req.setName(button.buttonName)
        req.setTag(button.tag)
        buttonsList.push(req)
      }
      grpcReq.setDeviceId(req.deviceId)
      grpcReq.setName(req.remoteName)
      grpcReq.setTag(req.remoteType)
      grpcReq.setButtonsList(buttonsList)

      this.piremClient.createRemote(grpcReq, {}, (err, apiRes) => {
        if (err !== null) {
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

        const remote: Remote = {
          id: apiRes.getId(),
          name: apiRes.getName(),
          tag: apiRes.getTag(),
          deviceId: apiRes.getDeviceId(),
          buttonIds: apiRes.getButtonsList().map((button) => button.getId())
        }

        const buttons: Button[] = apiRes.getButtonsList().map((button) => {
          return {
            id: button.getId(),
            name: button.getName(),
            remoteId: apiRes.getId(),
            tag: button.getTag(),
            hasIrData: button.getHasIrData()
          }
        })

        resolve({
          isError: false,
          data: {
            remote,
            buttons,
          }
        })
      })
    })
  }

  async updateRemotes(req: UpdateRemoteReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new UpdateRemoteRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)
      apiReq.setName(req.remoteName)
      apiReq.setDeviceId(req.deviceId)
      this.piremClient.updateRemote(apiReq, {}, (err) => {
        if (err !== null) {
          switch (err.code) {
            case StatusCode.ALREADY_EXISTS:
              errCode = 'remote_name_already_exists'
              break
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

  async deleteRemotes(req: DeleteRemoteReq): Promise<Result<void, ApiError>> {
    return await new Promise((resolve) => {
      const apiReq = new DeleteRemoteRequest()
      let errCode: ErrorCode = 'unknown'

      apiReq.setRemoteId(req.remoteId)
      this.piremClient.deleteRemote(apiReq, {}, (err) => {
        if (err !== null) {
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
}
