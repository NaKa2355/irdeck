import { selector } from "recoil";
import { devicesAtom } from "../atoms/devices";
import { Device } from "../../type/device.type";

export const devicesCanSendSelector = selector({
    key: 'devicesCanSend',
    get: ({get}) => {
        const devices = get(devicesAtom);
        const devicesCanSend = new Map<string, Device>;
        devices.devices.forEach((device) => {
            if(device.canSend) {
                devicesCanSend.set(device.id, device);
            }
        });
        return devicesCanSend;
    }
});