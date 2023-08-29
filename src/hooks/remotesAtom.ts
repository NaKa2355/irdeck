import { atom } from "recoil";
import { Remote } from "../type/remote";

export const remotesAtom = atom({key: "remotes", default: {remotes: new Map<string, Remote>, isCached: false}});