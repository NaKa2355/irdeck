
import { useState } from "react";
import { aimClient } from "../constatnts";
import * as aim from "irdeck-proto/gen/js/aim/api/v1/aim_service_pb";
import { IrData } from "../type/irdata.type";
import { Button } from "../type/button";
import { useRecoilState } from "recoil";
import { buttonsAtom } from "./buttonsAtom";
import { RpcError } from "grpc-web";

interface useButtonReturnValue {
    buttons: Map<string, Button>
    get: (remoteId:string) => Promise<void>
    add: (remoteId:string, buttonName:string) => Promise<void>,
    delete: (remoteId:string, buttonId: string) => Promise<void>,
    rename: (remoteId:string, buttonId: string, name:string) => Promise<void>,
    setIr: (remoteId:string, buttonId: string, irData: IrData) => Promise<void>,
    getIr: (remoteId:string, buttonId: string) => Promise<IrData>,
}

export function useButtonsGetter(remoteId: string): FetchResponse<Map<string, Button>, RpcError> {
    let [data, setData] = useRecoilState(buttonsAtom(remoteId));
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<RpcError | undefined>(undefined);

    const onFetchStart = () => {
        setIsFetching(true);
    };

    const onSuccess = () => {
        setIsError(false);
        setIsFetching(false);
    };

    const onError = (err: RpcError) => {
        setIsError(true);
        setError(err);
        setIsFetching(false);
    };

    const fetch = () => {
        const promise = new Promise<void>((resolve) => {
            let req = new aim.GetButtonsRequest();
            req.setRemoteId(remoteId);
            onFetchStart();
            aimClient.getButtons(req, {}, (err, res) => {
                if(err) {
                    onError(err);
                    resolve();
                    return
                }

                let buttons = new Map<string, Button>();
                for(let i = 0; i < res.getButtonsList().length; i++) {
                    const command = res.getButtonsList()[i];
                    buttons.set(
                        command.getId(),
                        {
                        id: command.getId(),
                        name: command.getName(),
                        hasIrData: command.getHasIrdata(),
                        
                    } as Button);
                    onSuccess();
                    setData({
                        buttons: buttons,
                        isCached: true,
                    });
                }
                resolve();
            });
        })
        return promise
    }


    return {
        data: data.buttons,
        fetch: fetch,
        isCached: data.isCached,
        isError: isError,
        error: error,
        isFetching: isFetching,
    };
}