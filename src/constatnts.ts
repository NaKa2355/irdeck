import { PiRemServiceClient } from 'pirem-proto/gen/js/api/v1/pirem_service_grpc_web_pb'

export const url = 'http://' + location.host + '/'
export const piremClient = new PiRemServiceClient(url)
