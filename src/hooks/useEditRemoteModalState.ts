import { useRecoilValue } from "recoil";
import { EditRemoteModalAtom } from "../recoil/atoms/editRemoteModal";

export const useEditRemoteModalState = () => {
    const editRemoteModalState = useRecoilValue(EditRemoteModalAtom);
    return editRemoteModalState;
};