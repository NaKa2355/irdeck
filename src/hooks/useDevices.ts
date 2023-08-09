import { useState } from "react"
import { GetAllDeviceInfoRequest } from "irdeck-proto/gen/js/pirem/api/v1/pirem_service_pb"
import { Device } from "../type/device.type"
import { piremClient } from "../constatnts"

export function useDevices(): 
[(Map<string, Device>), () => Promise<void>] {
    const [devices, setDevices] = useState<Map<string, Device>>(new Map<string, Device>());
   
    const request = (): Promise<void> => {
        const promise = new Promise<void>((resolve, reject) => {
            console.log(piremClient)
            piremClient.getAllDeviceInfo(new GetAllDeviceInfoRequest(), {}, (err, res) => {
                let devices = new Map<string, Device>();
                if (err) {
                    reject(err);
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
                
                setDevices(devices);
                resolve();
            })
        })
        return promise
    }
    
    return [devices, request]
}
