import { RpcError } from "grpc-web";
import { atom } from "recoil";
import { Device } from "../../type/device.type";

type EditRemoteModalState = {
    isOpen: boolean;
    remoteId: string;
    name: string;
    nameValidationError: {
        isError: false,
    } | {
        isError: true,
        message: string,
    };
    devices: Map<string, Device>;
    deviceId: string;
    isError: boolean;
    error: RpcError | undefined;
    canSubmit: boolean;
};

export const EditRemoteModalAtom = atom<EditRemoteModalState>({
    key: "editRemoteModal",
    default: {
        isOpen: false,
        remoteId: "",
        name:"",
        nameValidationError: { isError: false },
        devices: new Map(),
        deviceId: "",
        isError: false,
        error: undefined,
        canSubmit: true
    },
});