import { useRecoilState, useRecoilValue } from "recoil"
import { devicesCanReceiveSelector } from "../recoil/selector/devicesCanReceive";
import { useRemotes } from "./useRemotes";
import { EditRemoteModalAtom } from "../recoil/atoms/editRemoteModal";
import { remotesAtom } from "../recoil/atoms/remotes";

export const useEditRemoteModal = () => {
    const [modalState, setModalState] = useRecoilState(EditRemoteModalAtom);
    const devicesCanSend = useRecoilValue(devicesCanReceiveSelector);
    const remotesActions = useRemotes();
    const remotesAtomData = useRecoilValue(remotesAtom);
    
    const openModal = (remoteId: string) => {
        if (devicesCanSend.size === 0) {
            return;
        }
        const remote = remotesAtomData.remotes.get(remoteId);
        if (!remote) {
            return;
        }

        setModalState({
            isOpen: true,
            remoteId: remoteId,
            name: remote.name,
            nameValidationError: { isError: false },
            devices: devicesCanSend,
            deviceId: remote.deviceId,
            isError: false,
            error: undefined,
            canSubmit: true
        });
    };

    const closeModal = () => {
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
            nameValidationError: {
                isError: false,
            },
            canSubmit: true,
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

    const submit = async () => {
        if (modalState.isOpen) {
            await remotesActions.editRemote(modalState.remoteId, modalState.name, modalState.deviceId);
        }
    };

    return {
        open: openModal,
        close: closeModal,
        onNameChanged: onNameChanged,
        onDeviceChanged: onDeviceChanged,
        submit: submit,
    };
}