import { RpcError } from "grpc-web";
import { Remote } from "../type/remote";
import { AddRemoteRequest } from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { Button } from "../type/button";
import { aimClient } from "../constatnts";
import { Result } from "../type/result";

export const addRemote = (name: string, tag: string, deviceId: string, buttons: Array<{name: string, tag: string}>) => {
    const promise = new Promise<Result<Remote, RpcError>>((resolve) => {
        const grpcReq = new AddRemoteRequest();
        const buttonsList = new Array<AddRemoteRequest.Button>
        for (const button of buttons) {
            const req = new AddRemoteRequest.Button;
            req.setName(button.name);
            req.setTag(button.tag);
            buttonsList.push(req);
        }
        grpcReq.setDeviceId(deviceId);
        grpcReq.setName(name);
        grpcReq.setTag(tag);
        grpcReq.setButtonsList(buttonsList);
        aimClient.addRemote(grpcReq, {}, (err, res) => {
            if (err) {
                resolve({
                    isError: true,
                    error: err,
                });
                return;
            }

            let remoteId = res.getRemoteId();

            resolve({
                isError: false,
                data: {
                    id: remoteId,
                    name: name,
                    deviceId: deviceId,
                    tag: tag,
                },
            });
        });
    })
    return promise;
}