import { SendIrRequest } from "irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb"
import { IrData } from "../type/irdata.type"
import * as pirem from "irdeck-proto/gen/js/pirem/api/v1/irdata_pb"
import { piremClient } from "../constatnts"


export function useIrSender(): 
[(deviceId: string, irData: IrData) => Promise<void>] {
    const request = (deviceId: string, irData: IrData) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new SendIrRequest();
        
            req.setDeviceId(deviceId);
            req.setIrData(pirem.IrData.deserializeBinary(irData));
            
            piremClient.sendIr(req, {}, (err, _) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve();
            })
        })
        return promise
    }
    return [request]
}