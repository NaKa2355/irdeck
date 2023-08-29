import { useState } from "react"
import { GetAllDeviceInfoRequest } from "irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb"
import { Device } from "../type/device.type"
import { piremClient } from "../constatnts"
import { RpcError } from "grpc-web";
import { useRecoilState } from "recoil";
import { devicesAtom } from "./devicesAtom";

export function useDevicesGetter(): FetchResponse<Map<string, Device>, RpcError>{
    const [data, setData] = useRecoilState(devicesAtom);
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
   
    const fetch = (): Promise<void> => {
        const promise = new Promise<void>((resolve) => {
            onFetchStart();
            piremClient.getAllDeviceInfo(new GetAllDeviceInfoRequest(), {}, (err, res) => {
                let devices = new Map<string, Device>();
                if (err) {
                    onError(err);
                    resolve();
                    return;
                }
    
                for (let i = 0; i < res.getDeviceInfoList().length; i++) {
                    let dev = res.getDeviceInfoList()[i];
                    devices.set(
                        dev.getId(),
                        {
                        id: dev.getId(),
                        name: dev.getName(),
                        canSend: dev.getCanSend(),
                        canReceive: dev.getCanReceive(),
                        bufferSize: dev.getBufferSize(),
                        driverVersion: dev.getDriverVersion(),
                        firmwareVersion: dev.getFirmwareVersion(),
                    } as Device)
                }
                
                setData({
                    devices: devices,
                    isCached: true,
                });
                onSuccess();
                resolve();
            })
        })
        return promise
    }
    
    return {
        data: data.devices,
        isCached: data.isCached,
        isFetching: isFetching,
        isError: isError,
        error: error,
        fetch: fetch,
    };
}
