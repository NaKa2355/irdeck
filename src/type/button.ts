import { type RemoteId } from './remote'

export type ButtonName = string
export type ButtonId = string

export interface Button {
  remoteId: RemoteId
  name: ButtonName
  id: ButtonId
  tag: string
  hasIrData: boolean
}
