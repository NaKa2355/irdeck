export enum RemoteType {
  //    Custom = "custom",
  Button = 'button',
  Toggle = 'toggle',
  Thermostat = 'thermostat',
}

export type RemoteId = string
export type RemoteName = string

export interface Remote {
  name: string
  id: string
  deviceId: string
  tag: string
}
