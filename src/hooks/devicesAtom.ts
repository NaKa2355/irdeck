import { atom } from "recoil";
import { Device } from "../type/device.type";

export const devicesAtom = atom({key: "devices", default: {devices: new Map<string, Device>, isCached: false}});