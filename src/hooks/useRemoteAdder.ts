import { Remote } from "../type/remote";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { useRecoilState } from "recoil";
import { remotesAtom } from "./remotesAtom";

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


interface useRemoteAdderReturnValue {
    add: (req: AddRemoteRequest) => Promise<string>
}

export function useRemoteAdder(): useRemoteAdderReturnValue {
    let [data, setData] = useRecoilState(remotesAtom);
    const addRemote = (req: AddRemoteRequest) => {
        const promise = new Promise<string>((exec, reject) => {
            const grpcReq = new aim.AddRemoteRequest();
            const buttonsList = new Array<aim.AddRemoteRequest>
            for(const button of req.buttons) {
                const req = new aim.AddRemoteRequest;
                req.setName(button.name);
                req.setTag(button.tag);
                buttonsList.push(req);
            }
            grpcReq.setDeviceId(req.deviceId);
            grpcReq.setName(req.name);
            grpcReq.setTag(req.tag);
            grpcReq.setButtonsList(buttonsList);
            aimClient.addRemote(grpcReq, {}, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                let remoteId = res.getRemoteId();
                const remotes = new Map(data.remotes);
                remotes.set(
                    remoteId,
                    {
                        id: remoteId,
                        name: req.name,
                        deviceId: req.deviceId,
                        tag: req.tag,
                    } as Remote
                );
                setData({
                    ...data,
                    remotes: remotes,
                });
                exec(res.getRemoteId());
            });
        })
        return promise;
    }

    return {
        add: addRemote,
    }
}