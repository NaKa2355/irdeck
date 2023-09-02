import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { IrData } from "../type/irdata.type";
import { Any } from 'google-protobuf/google/protobuf/any_pb';
import { Button } from "../type/button";
import { useRecoilState } from "recoil";
import { buttonsAtom } from "./buttonsAtom";


export function useIrSetter(remoteId: string) {
    let [data, setData] = useRecoilState(buttonsAtom(remoteId));
    const setIrData = (buttonId: string, irData: IrData) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.SetIRDataRequest();
            let any = new Any();
            any.pack(irData, "IrData")

            req.setRemoteId(remoteId)
            req.setButtonId(buttonId)
            req.setIrdata(any)
            
            aimClient.setIrData(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }

                const buttons = new Map(data.buttons)
                let command = buttons.get(buttonId) as Button
                command.hasIrData = true
                buttons.set(buttonId, command)
                setData({
                    ...data,
                    buttons: buttons,
                })

                resolve()
            })
        })
        return promise
    }

    return {
        setIr: setIrData,
    };
}