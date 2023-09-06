import { atom } from "recoil";
import { Device } from "../../type/device.type";
import { RpcError } from "grpc-web";

interface DeviesAtomData {
    devices: Map<string, Device>;
    isCached: boolean,
    isLoading: boolean,
    isError: boolean,
    error: RpcError | undefined,
}

export const devicesAtom = atom<DeviesAtomData>({
    key: "devices",
    default: {
        devices: new Map<string, Device>,
        isCached: false,
        isLoading: false,
        isError: false,
        error: undefined,
    }
});