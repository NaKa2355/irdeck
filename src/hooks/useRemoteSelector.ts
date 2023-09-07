import { useRecoilState } from "recoil";
import { selectedRemoteAtom } from "../recoil/atoms/selectedRemote";
import { Remote } from "../type/remote";

export const useRemoteSelector = () => {
    const [selectedRemote, setSelectedRemoteId] = useRecoilState(selectedRemoteAtom);

    const selectRemote = (remote: Remote) => {
        setSelectedRemoteId(remote);
    }

    return {
        selectedRemote: selectedRemote,
        selectRemote: selectRemote,
    }
}