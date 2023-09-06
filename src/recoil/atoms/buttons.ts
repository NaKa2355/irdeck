import { atomFamily } from "recoil";
import { Button } from "../../type/button";
import { RpcError } from "grpc-web";

interface ButtonsAtomData {
    buttons: Map<string, Button>;
    isCached: boolean,
    isLoading: boolean,
    isError: boolean,
    error: RpcError | undefined,
}

export const buttonsAtom = atomFamily<ButtonsAtomData, string>({
    key: "buttons",
    default: {
        buttons: new Map<string, Button>,
        isCached: false,
        isLoading: false,
        isError: false,
        error: undefined,
    },
});