export enum RemoteType {
  //    Custom = "custom",
  Button = 'button',
  Toggle = 'toggle',
  Thermostat = 'thermostat',
}

export interface Remote {
  name: string
  id: string
  deviceId: string
  tag: string
  buttonIds: string[]
}
