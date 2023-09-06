import { RpcError } from "grpc-web";
import { atom } from "recoil";
import { Device } from "../../type/device.type";



type ReceiveIrModalState = {
    isOpen: true;
    remoteId: string;
    buttonId: string;
    sendDeviceId: string;
    receiveDeviceId: string;
    devicesCanReceive: Map<string, Device>;
    isError: boolean;
    error: RpcError | undefined;
} | {
    isOpen: false;
};

export const EditRemoteModalAtom = atom<ReceiveIrModalState>({
    key: "editRemoteModal",
    default: {
       isOpen: false,
    },
});