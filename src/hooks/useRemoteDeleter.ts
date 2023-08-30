import { RemoteType, Remote } from "../type/remote";
import { useState } from "react";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import * as remote from "irdeck-proto/gen/js/aim/api/v1/remote_pb";
import { useRecoilState } from "recoil";
import { remotesAtom } from "./remotesAtom";

interface useRemoteDeleterReturnValue {
    delete: (applianceId: string) => Promise<void>
}

export function useRemoteDelter(): useRemoteDeleterReturnValue{

    let [data, setData] = useRecoilState(remotesAtom);

    const deleteRemote = (applianceId: string) => {
        const promise = new Promise<void>((exec, reject) => {
            let req = new aim.DeleteRemoteRequest();
            req.setRemoteId(applianceId);
            aimClient.deleteRemote(req, {}, (err, _) => {
                if(err) {
                    reject(err);
                    return;
                }

                const remotes = new Map(data.remotes);
                remotes.delete(applianceId);
                setData({
                    ...data,
                    remotes: remotes,
                });
                exec();
            })
        })
        return promise
    }

    return {
        delete: deleteRemote,
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
