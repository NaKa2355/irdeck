import { RemoteType } from "../type/remote";
import * as api from "../api";
import { useRecoilState } from "recoil";
import { remotesAtom } from "../recoil/atoms/remotes";
import { RpcError, StatusCode } from "grpc-web";
import { useRemoteSelector } from "./useRemoteSelector";

export interface AddRemoteRequest {
    remoteType: RemoteType;
    name: string;
    deviceId: string;
    heatTempRange: [number, number];
    coolTempRange: [number, number];
    scale: string;
}

const getButtons = (req: AddRemoteRequest) => {
    const buttons = new Array<{ name: string, tag: string }>;
    switch (req.remoteType) {
        case RemoteType.Button:
            buttons.push({
                name: "push",
                tag: req.remoteType,
            });
            break;
        case RemoteType.Toggle:
            buttons.push({
                name: "on",
                tag: req.remoteType,
            });
            buttons.push({
                name: "off",
                tag: req.remoteType,
            });
            break;
        case RemoteType.Thermostat:
            for (let i = req.heatTempRange[0]; i <= req.heatTempRange[1]; i += Number(req.scale)) {
                buttons.push({
                    name: "h" + i.toFixed(1),
                    tag: RemoteType.Thermostat
                })
            }

            for (let i = req.coolTempRange[0]; i <= req.coolTempRange[1]; i += Number(req.scale)) {
                buttons.push({
                    name: "c" + i.toFixed(1),
                    tag: RemoteType.Thermostat
                })
            }
            break;
        default:
            return;
    }
    return buttons;
};

export const useRemotes = () => {
    const [remotesAtomData, setRemotes] = useRecoilState(remotesAtom);
    const remoteSelector = useRemoteSelector();

    const addRemote = async (req: AddRemoteRequest): Promise<RpcError | undefined> => {
        const buttons = getButtons(req);
        if (!buttons) {
            return;
        }

        const result = await api.addRemote(req.name, req.remoteType, req.deviceId, buttons);

        if (result.isError) {
            return result.error;
        }
        const remotes = new Map(remotesAtomData.remotes);
        const remote = {
            id: result.data.id,
            name: req.name,
            tag: req.remoteType,
            deviceId: req.deviceId,
        };

        remotes.set(result.data.id, remote);

        setRemotes({
            ...remotesAtomData,
            remotes: remotes,
        });

        remoteSelector.selectRemote(remote);
        return;
    };

    const deleteRemote = async (remoteId: string): Promise<RpcError | undefined> => {
        const result = await api.deleteRemotes(remoteId);
        if (result.isError) {
            if (result.error.code === StatusCode.NOT_FOUND) {
                return;
            }
            return result.error;
        }

        const remotes = new Map(remotesAtomData.remotes);
        remotes.delete(remoteId);

        setRemotes({
            ...remotesAtomData,
            remotes: remotes,
        });

        if (remoteId === remoteSelector.selectedRemote?.id) {
            remoteSelector.selectRemote(Array.from(remotes)[0][1]);
        }
    };

    const editRemote = async (remoteId: string, name: string, deviceId: string): Promise<RpcError | undefined> => {
        const result = await api.editRemote(remoteId, name, deviceId);
        if (result.isError) {
            return result.error;
        }
        const remotes = new Map(remotesAtomData.remotes);
        const remote = remotes.get(remoteId);
        if (remote) {
            remotes.set(remoteId, {
                ...remote,
                name: name,
                deviceId: deviceId,
            });

            setRemotes({
                ...remotesAtomData,
                remotes: remotes,
            });
        }
    };

    const getRemotes = async (): Promise<RpcError | undefined> => {
        setRemotes({
            ...remotesAtomData,
            isLoading: true,
        });
        const result = await api.getRemotes();
        if (result.isError) {
            setRemotes({
                ...remotesAtomData,
                isLoading: false,
                isError: true,
                error: result.error,
            });
            return result.error;
        }

        setRemotes({
            ...remotesAtomData,
            remotes: result.data,
            isLoading: false,
            isCached: true,
            isError: true,
        });

        if (remoteSelector.selectedRemote?.id && result.data.size != 0) {
            remoteSelector.selectRemote(Array.from(result.data)[0][1]);
        }
    };

    return {
        addRemote: addRemote,
        getRemotes: getRemotes,
        editRemote: editRemote,
        deleteRemote: deleteRemote,
    }
};