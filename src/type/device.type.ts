export type DeviceName = string
export type DeviceId = string

export interface Device {
  name: DeviceName
  id: DeviceId
  canSend: boolean
  canReceive: boolean
  bufferSize: number
  driverVersion: string
  firmwareVersion: string
}
