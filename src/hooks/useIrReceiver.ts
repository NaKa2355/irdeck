import { ReceiveIrRequest } from "irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb";
import { IrData } from "../type/irdata.type";
import { piremClient } from "../constatnts";

export function useIrReceiver(): 
[(deviceId: string) => Promise<IrData>] {
    const receiveIr = (deviceId: string) => {
        const promise = new Promise<IrData>((resolve, reject) => {
            let req = new ReceiveIrRequest();
       
            req.setDeviceId(deviceId);
    
            piremClient.receiveIr(req, {}, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                resolve(res.getIrData()?.serializeBinary() ?? new Uint8Array())
            })
        })
        return promise
    }
    return [receiveIr]
}