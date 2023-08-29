export enum RemoteType {
    Custom = "custom",
    Button = "button",
    Toggle = "toggle",
    Thermostat = "thermostat",
  }

export type Remote = {
    name: string
    id: string
    deviceId: string
    tag: string
}