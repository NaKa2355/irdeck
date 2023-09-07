import { useRecoilState, useRecoilValue } from "recoil"
import { AddRemoteModalAtom } from "../recoil/atoms/addRemoteModal";
import { RemoteType } from "../type/remote";
import { devicesCanReceiveSelector } from "../recoil/selector/devicesCanReceive";
import { useRemotes } from "./useRemotes";


export const useAddRemoteModal = () => {
    const [modalState, setModalState] = useRecoilState(AddRemoteModalAtom);
    const devicesCanSend = useRecoilValue(devicesCanReceiveSelector);
    const remotesAction = useRemotes();

    const openModal = () => {
        if (devicesCanSend.size === 0) {
            return;
        }

        setModalState({
            isOpen: true,
            remoteType: RemoteType.Button,
            name: "",
            nameValidationError: { isError: false },
            devices: devicesCanSend,
            deviceId: Array.from(devicesCanSend)[0][0],
            scales: ["0.5", "1"],
            scale: "0.5",
            heatTempRange: [0, 25],
            coolTempRange: [10, 35],
            isError: false,
            error: undefined,
            canSubmit: false,
        });
    };

    const closeModal = () => {
        if(modalState.isOpen === undefined) {
            return;
        }
        setModalState({
            ...modalState,
            isOpen: false,
        });
    };

    const onNameChanged = (name: string) => {
        if (!modalState.isOpen) {
            return;
        }

        if (name.length > 15) {
            setModalState({
                ...modalState,
                name: name,
                nameValidationError: {
                    isError: true,
                    message: "error.remote_name_length",
                },
                canSubmit: false,
            });
            return;
        }

        if (name.length === 0) {
            setModalState({
                ...modalState,
                name: name,
                nameValidationError: {
                    isError: true,
                    message: "error.remote_name_required",
                },
                canSubmit: false,
            });
            return;
        }

        setModalState({
            ...modalState,
            name: name,
            canSubmit: true,
            nameValidationError: {
                isError: false,
            }
        });
    };

    const onDeviceChanged = (deviceId: string) => {
        if (!modalState.isOpen) {
            return;
        }

        setModalState({
            ...modalState,
            deviceId: deviceId,
        });
    };

    const onScaleChanged = (scale: string) => {
        if (!modalState.isOpen) {
            return;
        }

        setModalState({
            ...modalState,
            scale: scale,
        });
    };

    const onHeatTempRangeChanged = (heatTempRange: [number, number]) => {
        if (!modalState.isOpen) {
            return;
        }

        setModalState({
            ...modalState,
            heatTempRange: heatTempRange,
        });
    };

    const onCoolTempRangeChanged = (coolTempRange: [number, number]) => {
        if (!modalState.isOpen) {
            return;
        }

        setModalState({
            ...modalState,
            coolTempRange: coolTempRange,
        });
    };

    const onRemoteTypeChanged = (remoteType: RemoteType) => {
        if (!modalState.isOpen) {
            return;
        }

        setModalState({
            ...modalState,
            remoteType: remoteType,
        });
    }
    

    const submit = async () => {
        if(!modalState.canSubmit) {
            return;
        }

        const error = await remotesAction.addRemote(modalState);
        if(error) {
            return;
        }

        setModalState({
            ...modalState,
            isOpen: false,
        });
    };

    return {
        open: openModal,
        close: closeModal,
        onNameChanged: onNameChanged,
        onCoolTempRangeChanged: onCoolTempRangeChanged,
        onHeatTempRangeChanged: onHeatTempRangeChanged,
        onDeviceChanged: onDeviceChanged,
        onScaleChanged: onScaleChanged,
        onRemoteTypeChanged: onRemoteTypeChanged,
        submit: submit,
    };
}