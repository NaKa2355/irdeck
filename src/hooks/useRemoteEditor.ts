import { Remote } from "../type/remote";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { useRecoilState } from "recoil";
import { remotesAtom } from "./remotesAtom";

interface useRemoteEditorReturnValue {
    edit: (applianceId: string, name:string, deviceId: string) => Promise<void>
}

export function useRemoteEditor(): useRemoteEditorReturnValue {
    let [data, setData] = useRecoilState(remotesAtom);

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
                
                const remotes = new Map(data.remotes)
                let app = remotes.get(applianceId) as Remote;
                app.name = name;
                app.deviceId = deviceId;
                remotes.set(applianceId, app);
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
        edit: editRemote
    }
}