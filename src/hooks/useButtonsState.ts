import { useRecoilValue } from "recoil"
import { buttonsAtom } from "../recoil/atoms/buttons";
import { Remote } from "../type/remote";

export const useButtonsState = (remote?: Remote) => {
    const buttons = useRecoilValue(buttonsAtom(remote?.id ?? ""));
    return buttons;
};