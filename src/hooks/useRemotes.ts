import { RemoteType } from "../type/remote";
import * as api from "../api";
import { useRecoilState } from "recoil";
import { remotesAtom } from "../recoil/atoms/remotes";
import { StatusCode } from "grpc-web";
import { selectedRemoteIdAtom } from "../recoil/atoms/selectedRemoteId";
import { useButtons } from "./useButtons";
import { AddRemoteRequest } from "../recoil/atoms/addRemoteModal";


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
}

export const useRemotes = () => {
    const [remotesAtomData, setRemotes] = useRecoilState(remotesAtom);
    const [selectedRemote, setSelectedRemoteId] = useRecoilState(selectedRemoteIdAtom);
    
    const addRemote = async (req: AddRemoteRequest) => {
        const buttons = getButtons(req);
        if (!buttons) {
            return;
        }

        const result = await api.addRemote(req.name, req.remoteType, req.deviceId, buttons);

        if (result.isError) {
            return;
        }
        const remotes = new Map(remotesAtomData.remotes);
        remotes.set(result.data.id, {
            id: result.data.id,
            name: req.name,
            tag: req.remoteType,
            deviceId: req.deviceId,
        });

        setRemotes({
            ...remotesAtomData,
            remotes: remotes,
        });

        setSelectedRemoteId(result.data.id);
    };

    const deleteRemote = async (remoteId: string) => {
        const result = await api.deleteRemotes(remoteId);
        if (result.isError && result.error.code !== StatusCode.NOT_FOUND) {
            return;
        }
        const remotes = new Map(remotesAtomData.remotes);
        remotes.delete(remoteId);

        setRemotes({
            ...remotesAtomData,
            remotes: remotes,
        });

        if(remoteId === selectedRemote) {
            setSelectedRemoteId(Array.from(remotes)[0][0]);
        }
    };

    const editRemote = async (remoteId: string, name: string, deviceId: string) => {
        const result = await api.editRemote(remoteId, name, deviceId);
        if (result.isError) {
            return;
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

    const getRemotes = async () => {
        setRemotes({
            ...remotesAtomData,
            isLoading: true,
        });
        const result = await api.getRemotes();
        if(result.isError) {
            setRemotes({
                ...remotesAtomData,
                isLoading: false,
                isError: true,
                error: result.error,
            });
            return;
        }

        setRemotes({
            ...remotesAtomData,
            remotes: result.data,
            isLoading: false,
            isCached: true,
            isError: true,
        });

        if(selectedRemote === "" && result.data.size != 0) {
            setSelectedRemoteId(Array.from(result.data)[0][0]);
        }
    };

    const selectRemote = (remoteId: string) => {
        setSelectedRemoteId(remoteId);
    }

    return {
        addRemote: addRemote,
        getRemotes: getRemotes,
        editRemote: editRemote,
        deleteRemote: deleteRemote,
        selectRemote: selectRemote,
    }
}