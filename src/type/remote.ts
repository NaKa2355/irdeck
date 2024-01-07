import { type ButtonId } from './button'
import { type DeviceId } from './device.type'

export enum RemoteType {
  //    Custom = "custom",
  Button = 'button',
  Toggle = 'toggle',
  Thermostat = 'thermostat',
}

export type RemoteId = string
export type RemoteName = string

export interface Remote {
  name: RemoteName
  id: RemoteId
  deviceId: DeviceId
  buttonIds: ButtonId[]
  tag: string
}
