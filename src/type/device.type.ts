export type Device = {
    name: string
    id: string
    canSend: Boolean
    canReceive: boolean
    bufferSize: Number
    driverVersion: string
    firmwareVersion: string
}