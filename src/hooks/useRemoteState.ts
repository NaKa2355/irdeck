import { useRecoilValue } from "recoil"
import { remotesAtom } from "../recoil/atoms/remotes"

export const useRemoteState = () => {
    const remotes = useRecoilValue(remotesAtom);
    return remotes;
};

