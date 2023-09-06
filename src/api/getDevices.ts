import { RpcError } from "grpc-web";
import { Result } from "./result";
import { Device } from "../type/device.type";
import { piremClient } from "../constatnts";
import { GetAllDeviceInfoRequest } from "irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb";

export const getDevices = () => {
    const promise = new Promise<Result<Map<string, Device>, RpcError>>((resolve) => {
        piremClient.getAllDeviceInfo(new GetAllDeviceInfoRequest(), {}, (err, res) => {
            let devices = new Map<string, Device>();
            if (err) {
                resolve({
                    isError: true,
                    error: err,
                });
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

            resolve({
                isError: false,
                data: devices,
            });
        });
    });
    
    return promise;
}