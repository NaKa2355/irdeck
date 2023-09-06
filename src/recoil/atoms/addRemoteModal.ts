import { atom } from "recoil";
import { RemoteType } from "../../type/remote";
import { RpcError } from "grpc-web";
import { Device } from "../../type/device.type";

export type AddRemoteModalState = {
    isOpen: boolean,
    remoteType: RemoteType;
    name: string;
    nameValidationError: {
        isError: false,
    } | {
        isError: true,
        message: string,
    },
    devices: Map<string, Device>,
    deviceId: string;
    heatTempRange: [number, number],
    coolTempRange: [number, number],
    scales: Array<string>,
    scale: string,
    isError: boolean,
    error: RpcError | undefined,
    canSubmit: boolean,
};

export const AddRemoteModalAtom = atom<AddRemoteModalState>({
    key: "addRemoteModal",
    default: {
        isOpen: false,
        remoteType: RemoteType.Button,
        name: "",
        nameValidationError: { isError: false },
        devices: new Map(),
        deviceId: "",
        scales: ["0.5", "1"],
        scale: "0.5",
        heatTempRange: [0, 25],
        coolTempRange: [10, 35],
        isError: false,
        error: undefined,
        canSubmit: false,
    },
});