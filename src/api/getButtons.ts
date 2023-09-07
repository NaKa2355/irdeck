import { RpcError } from "grpc-web";
import { Button } from "../type/button";
import { Result } from "../type/result";
import { GetButtonsRequest } from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { aimClient } from "../constatnts";

export const getButtons = (remoteId: string) => {
    const promise = new Promise<Result<Map<string, Button>, RpcError>>((resolve) => {
        let req = new GetButtonsRequest();
        req.setRemoteId(remoteId);

        aimClient.getButtons(req, {}, (err, res) => {
            if (err) {
                resolve({
                    isError: true,
                    error: err,
                });
                return
            }

            let buttons = new Map<string, Button>();
            for (let i = 0; i < res.getButtonsList().length; i++) {
                const command = res.getButtonsList()[i];
                buttons.set(
                    command.getId(),
                    {
                        id: command.getId(),
                        name: command.getName(),
                        hasIrData: command.getHasIrdata(),

                    } as Button);
            }
            resolve({
                isError: false,
                data: buttons,
            });
        });
    });

    return promise;
}