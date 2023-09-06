import { selector } from "recoil";
import { devicesAtom } from "../atoms/devices";
import { Device } from "../../type/device.type";

export const devicesCanReceiveSelector = selector({
    key: 'devicesCanReceive',
    get: ({get}) => {
        const devices = get(devicesAtom);
        const devicesCanSend = new Map<string, Device>;
        devices.devices.forEach((device) => {
            if(device.canReceive) {
                devicesCanSend.set(device.id, device);
            }
        });
        return devicesCanSend;
    }
});