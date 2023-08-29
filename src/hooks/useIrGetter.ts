import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { IrData } from "../type/irdata.type";
import * as pirem from 'irdeck-proto/gen/js/pirem/api/v1/irdata_pb'

export function useIrGetter(): {getIr: (remoteId: string, buttonId: string) => Promise<IrData>} {

    const getIrData = (remoteId: string, buttonId: string) => {
        const promise = new Promise<IrData>((resolve, reject) => {
            let req = new aim.GetIrDataRequest();
            req.setRemoteId(remoteId);
            req.setButtonId(buttonId);

            aimClient.getIrData(req, {}, (err, res) => {
                if(err) {
                    reject(err);
                    return
                }
                
                let irData = res.unpack<pirem.IrData>(pirem.IrData.deserializeBinary, res.getTypeName())

                resolve(irData?.serializeBinary() ?? new Uint8Array())
            })
        })
        return promise
    }

    return {
        getIr: getIrData,
    };
}