import { PiRemServiceClient } from 'irdeck-proto/gen/js/pirem/api/v1/pirem_service_grpc_web_pb'
import { AimServiceClient } from 'irdeck-proto/gen/js/aim/api/v1/aim_service_grpc_web_pb'

export const url = 'http://' + location.host + '/'
export const piremClient = new PiRemServiceClient(url)
export const aimClient = new AimServiceClient(url)
