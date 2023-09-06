import { RpcError } from "grpc-web";
import { Result } from "./result";
import { EditRemoteRequest } from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { aimClient } from "../constatnts";

export const editRemote = (remoteId: string, name:string, deviceId: string) => {
    const promise = new Promise<Result<undefined, RpcError>>((resolve) => {
        let req = new EditRemoteRequest();
        req.setRemoteId(remoteId);
        req.setName(name);
        req.setDeviceId(deviceId);
        aimClient.editRemote(req, {}, (err) => {
            if (err) {
                resolve({
                    isError: true,
                    error: err,
                });
                return;
            }

            resolve({
                isError: false,
                data: undefined,
            });
        })
    })

    return promise;
}