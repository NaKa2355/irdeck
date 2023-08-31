import { atomFamily } from "recoil";
import { Button } from "../type/button";

interface ButtonsAtomData {
    buttons: Map<string, Button>;
    isCached: boolean,
}

export const buttonsAtom = atomFamily<ButtonsAtomData, string>({
    key: "buttons",
    default: {
        buttons: new Map<string, Button>,
        isCached: false
    },
});