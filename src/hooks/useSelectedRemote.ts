import { useRecoilValue } from "recoil"
import { selectedRemoteAtom } from "../recoil/atoms/selectedRemote";

export const useSelectedRemote = () => {
    const selectedRemote = useRecoilValue(selectedRemoteAtom);
    return selectedRemote;
};

