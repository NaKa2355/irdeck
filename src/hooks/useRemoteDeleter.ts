import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { useRecoilState } from "recoil";
import { remotesAtom } from "./remotesAtom";
import { StatusCode } from "grpc-web";

interface useRemoteDeleterReturnValue {
    delete: (applianceId: string) => Promise<void>
}

export function useRemoteDelter(): useRemoteDeleterReturnValue {

    let [data, setData] = useRecoilState(remotesAtom);

    const deleteRemote = (applianceId: string) => {
        const promise = new Promise<void>((exec, reject) => {
            let req = new aim.DeleteRemoteRequest();
            req.setRemoteId(applianceId);
            aimClient.deleteRemote(req, {}, (err, _) => {
                if (err) {
                    if (err.code !== StatusCode.NOT_FOUND) {
                        reject(err);
                        return;
                    }
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