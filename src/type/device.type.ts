export interface Device {
  name: string
  id: string
  canSend: boolean
  canReceive: boolean
  bufferSize: number
  driverVersion: string
  firmwareVersion: string
}
