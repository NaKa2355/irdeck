import { useState } from "react";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { IrData } from "../type/irdata.type";
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import * as pirem from 'irdeck-proto/gen/js/pirem/api/v1/irdata_pb'
import { Button } from "../type/button";

interface useButtonReturnValue {
    buttons: Map<string, Button>
    get: (remoteId:string) => Promise<void>
    add: (remoteId:string, buttonName:string) => Promise<void>,
    delete: (remoteId:string, buttonId: string) => Promise<void>,
    rename: (remoteId:string, buttonId: string, name:string) => Promise<void>,
    setIr: (remoteId:string, buttonId: string, irData: IrData) => Promise<void>,
    getIr: (remoteId:string, buttonId: string) => Promise<IrData>,
}

export function useButton(): useButtonReturnValue {
    let [buttons, setButtons] = useState(new Map<string, Button>());


    const getButtons = (remoteId: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.GetButtonsRequest();
            req.setRemoteId(remoteId)
            aimClient.getButtons(req, {}, (err, res) => {
                if(err) {
                    reject(err)
                    return
                }

                let buttons = new Map<string, Button>();
                for(let i = 0; i < res.getButtonsList().length; i++) {
                    const command = res.getButtonsList()[i];
                    buttons.set(
                        command.getId(),
                        {
                        id: command.getId(),
                        name: command.getName(),
                        hasIrData: command.getHasIrdata(),
                        
                    } as Button)
                    setButtons(buttons)
                }
                resolve();
            });
        })
        return promise
    }
    
    const addButton = (remoteId: string, buttonName: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.AddButtonRequest();
            req.setRemoteId(remoteId);
            req.setName(buttonName);
            
            aimClient.addButton(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        })

        return promise
    }

    const deleteButton = (remoteId: string, buttonId: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.DeleteButtonRequest();
            req.setRemoteId(remoteId)
            req.setButtonId(buttonId);
            
            aimClient.deleteButton(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }
            });

            resolve();
        })

        return promise
    }

    const renameButton = (remoteId: string, buttonId: string, name: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.EditButtonRequest();
            req.setRemoteId(remoteId)
            req.setButtonId(buttonId)
            req.setName(name)
    
            aimClient.editButton(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
        return promise 
    }

    const setIrData = (remoteId: string, buttonId: string, irData: IrData) => {
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

                buttons = new Map(buttons)
                let command = buttons.get(buttonId) as Button
                command.hasIrData = true
                buttons.set(buttonId, command)
                setButtons(buttons)

                resolve()
            })
        })
        return promise
    }

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
        buttons: buttons,
        get: getButtons,
        add: addButton,
        delete: deleteButton,
        rename: renameButton,
        setIr: setIrData,
        getIr: getIrData,
    };
}