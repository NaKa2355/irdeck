import { RemoteType, Remote } from "../type/remote";
import { useState } from "react";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import * as remote from "irdeck-proto/gen/js/aim/api/v1/remote_pb";
import { Any } from "google-protobuf/google/protobuf/any_pb";

export interface AddButtonRequest {
    name: string,
    tag: string,
}

export interface AddRemoteRequest {
    name: string
    deviceId: string
    tag: string
    buttons: Array<AddButtonRequest>
}


interface useRemoteReturnValue {
    remotes: Map<string, Remote>
    get: () => Promise<void>
    add: (req: AddRemoteRequest) => Promise<void>
    delete: (applianceId: string) => Promise<void>
    edit: (applianceId: string, name:string, deviceId: string) => Promise<void>
}

export function useRemotes(): useRemoteReturnValue {

    let [remotes, setRemotes] = useState<Map<string, Remote>>(new Map<string, Remote>());

    const get = () => {
        const promise = new Promise<void>((exec, reject) => {
            aimClient.getRemotes(new Any(), {}, (err, res) => {
                if(err) {
                    reject(err)
                    return
                }
                
                if(res.getRemotesList() === undefined) {
                    reject(new Error("undefined appliances"))
                    return
                }
    
                let remotes = new Map<string, Remote>();
                for(let i = 0; i < res.getRemotesList().length; i++) {
                    let app = res.getRemotesList()[i];
                   
                    remotes.set(
                        app.getId(), 
                        {
                        id: app.getId(),
                        name: app.getName(),
                        deviceId: app.getDeviceId(),
                        tag: app.getTag(),
                        } as Remote
                    )
                }
                setRemotes(remotes);
                exec();
            })
        })
        return promise
    }
    
    const addRemote = (req: AddRemoteRequest) => {
        const promise = new Promise<void>((exec, reject) => {
            const _req = new aim.AddRemoteRequest()
            const buttonsList = new Array<aim.AddButtonsRequest>
            req.buttons.forEach(button => {
                const req = new aim.AddButtonsRequest
                req.setName(button.name)
                req.setTag(button.tag)
                buttonsList.push(req)
            });
            _req.setDeviceId(req.deviceId)
            _req.setName(req.name)
            _req.setTag(req.tag)
            _req.setButtonsList(buttonsList)
            aimClient.addRemote(_req, {}, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
    
                let remoteId = res.getRemoteId()
                remotes = new Map(remotes)
                remotes.set(
                    remoteId,
                    {
                        id: remoteId,
                        name: req.name,
                        deviceId: req.deviceId,
                        tag: req.tag,
                    } as Remote
                )
                setRemotes(remotes)
                exec()
            })
        })
        return promise
    }

    const deleteRemote = (applianceId: string) => {
        const promise = new Promise<void>((exec, reject) => {
            let req = new aim.DeleteRemoteRequest();
            req.setRemoteId(applianceId);
            aimClient.deleteRemote(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }

                remotes = new Map(remotes);
                remotes.delete(applianceId);
                setRemotes(remotes);
                exec();
            })
        })
        return promise
    }

    const editRemote = (applianceId: string, name: string, deviceId: string) => {
        const promise = new  Promise<void>((exec, reject) => {
            let req = new aim.EditRemoteRequest();
            req.setRemoteId(applianceId);
            req.setName(name)
            req.setDeviceId(deviceId);
            aimClient.editRemote(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }
                
                remotes = new Map(remotes)
                let app = remotes.get(applianceId) as Remote;
                app.name = name;
                app.deviceId = deviceId;
                remotes.set(applianceId, app);
                setRemotes(remotes);
                exec();
            })
        })

        return promise
    }

    return {
        remotes: remotes,
        get: get,
        add: addRemote,
        delete: deleteRemote,
        edit: editRemote
    }
}


export function useRemote():
[Remote | undefined, (applianceId: string) => Promise<void>] {
    const [appliance, setRemote] = useState<Remote>()

    const getRemote = (applianceId: string) => {
        const promise = new Promise<void>((resolve, reject) => {
            let req = new aim.GetRemoteRequest()
            req.setRemoteId(applianceId)
            
            aimClient.getRemote(req, {}, (err, res) => {
                if(err) {
                    reject(err)
                    return
                }
    
                if(res.getRemote() === undefined) {
                    reject(err)
                    return
                }
    
                let app = res.getRemote() as remote.Remote
    
                setRemote({
                    id: app.getId(),
                    deviceId: app.getDeviceId(),
                    name: app.getName(),
                    tag: app.getTag(),
                });
                resolve()
            })
        })
        return promise
    }

    return [appliance, getRemote]
}
