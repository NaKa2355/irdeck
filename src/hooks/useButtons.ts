import { IrData } from "../type/irdata.type"
import * as api from "../api"
import { useRecoilState } from "recoil"
import { buttonsAtom } from "../recoil/atoms/buttons";

export const useButtons = (remoteId: string) => {
    const [buttonsAtomData, setButtons] = useRecoilState(buttonsAtom(remoteId));
    const getButtons = async () => {
        setButtons({
            ...buttonsAtomData,
            isLoading: true,
        });
        const result = await api.getButtons(remoteId);
        if (result.isError) {
            setButtons({
                ...buttonsAtomData,
                isError: true,
                isLoading: false,
                error: result.error,
            });
            return;
        }
        setButtons({
            ...buttonsAtomData,
            buttons: result.data,
            isError: false,
            isCached: false,
            isLoading: false,
        });
    };

    const setIrData = async (buttonId: string, irdata: IrData) => {
        const result = await api.setIrData(remoteId, buttonId, irdata);
        if (result.isError) {
            return;
        }
        const buttons = new Map(buttonsAtomData.buttons);
        const button = buttons.get(buttonId);
        if (button) {
            button.hasIrData = true;
            setButtons({
                ...buttonsAtomData,
            });
        }
    };

    return {
        getButtons: getButtons,
        setIrData: setIrData,
    }
}