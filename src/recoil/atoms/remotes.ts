import { atom } from "recoil";
import { Remote } from "../../type/remote";
import { RpcError } from "grpc-web";

interface RemotesAtomData {
    remotes: Map<string, Remote>;
    isCached: boolean,
    isLoading: boolean,
    isError: boolean,
    error: RpcError | undefined,
}


export const remotesAtom = atom<RemotesAtomData>({
    key: "remotes",
    default: {
        remotes: new Map<string, Remote>,
        isCached: false,
        isLoading: false,
        isError: false,
        error: undefined,
    }
});