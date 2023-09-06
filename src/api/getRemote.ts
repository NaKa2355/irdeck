import { RpcError } from "grpc-web";
import { aimClient } from "../constatnts";
import { Result } from "./result";
import { Remote } from "../type/remote";
import { Any } from "google-protobuf/google/protobuf/any_pb";

export const getRemotes = () => {
    const promise = new Promise<Result<Map<string, Remote>, RpcError>>((resolve) => {
        aimClient.getRemotes(new Any(), {}, (err, res) => {
            if (err) {
                resolve({
                    isError: true,
                    error: err,
                });
                return;
            };

            let remotes = new Map<string, Remote>();
            for (let i = 0; i < res.getRemotesList().length; i++) {
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

            resolve({
                isError: false,
                data: remotes,
            });
        });
    });
    return promise;
}