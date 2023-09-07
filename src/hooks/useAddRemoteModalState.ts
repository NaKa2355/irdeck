import { useRecoilValue } from "recoil"
import { AddRemoteModalAtom } from "../recoil/atoms/addRemoteModal";

export const useAddRemoteModalState = () => {
    const addRemoteModalState = useRecoilValue(AddRemoteModalAtom);
    return addRemoteModalState;
};

