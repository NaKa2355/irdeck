import { RpcError } from "grpc-web";
import { Result } from "./result";
import { SetIRDataRequest } from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { IrData } from "../type/irdata.type";
import { aimClient } from "../constatnts";

export const setIrData = (remoteId: string, buttonId: string, irData: IrData) => {
    const promise = new Promise<Result<undefined, RpcError>>((resolve) => {
        let req = new SetIRDataRequest();
        let any = new Any();
        any.pack(irData, "IrData");

        req.setRemoteId(remoteId);
        req.setButtonId(buttonId);
        req.setIrdata(any);

        aimClient.setIrData(req, {}, (err, _) => {
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
}