import { atom } from "recoil";
import { Remote } from "../../type/remote";



export const selectedRemoteAtom = atom<Remote | undefined>({
    key: "selectedRemote",
    default: undefined,
});
