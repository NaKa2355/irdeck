import { DeleteRemoteRequest } from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { aimClient } from "../constatnts";
import { Result } from "./result";
import { RpcError } from "grpc-web";

export const deleteRemotes = (remoteId: string) => {
    const promise = new Promise<Result<undefined, RpcError>>((resolve) => {
        let req = new DeleteRemoteRequest();
        req.setRemoteId(remoteId);
        aimClient.deleteRemote(req, {}, (err) => {
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
        });
    });
    return promise;
};