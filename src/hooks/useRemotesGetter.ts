import { Remote } from "../type/remote";
import { useState } from "react";
import { aimClient } from "../constatnts";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { RpcError } from "grpc-web";
import { useRecoilState } from "recoil";
import { remotesAtom } from "./remotesAtom";

export function useRemotesGetter(): FetchResponse<Map<string, Remote>, RpcError> {
    const [data, setRemotes] = useRecoilState(remotesAtom);
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<RpcError | undefined>(undefined);

    const onFetchStart = () => {
        setIsFetching(true);
    };

    const onSuccess = () => {
        setIsError(false);
        setIsFetching(false);
    };

    const onError = (err: RpcError) => {
        setIsError(true);
        setError(err);
        setIsFetching(false);
    };

    const fetch = () => {
        const promise = new Promise<void>((exec) => {
            onFetchStart();
            aimClient.getRemotes(new Any(), {}, (err, res) => {
                if(err) {
                    onError(err);
                    exec();
                    return
                }
    
                let remotes = new Map<string, Remote>();
                for(let i = 0; i < res.getRemotesList().length; i++) {
                    let app = res.getRemotesList()[i];
                   
                    remotes.set(
                        app.getId(), 
                        {
                        id: app.getId(),
                        name: app.getName(),
                        deviceId: app.getDeviceId(),
                        tag: app.getTag(),
                        } as Remote
                    )
                }

                setRemotes({
                    remotes: remotes,
                    isCached: true,
                });
                onSuccess();
                exec();
            })
        })
        return promise
    }
    
    return {
        data: data.remotes,
        isError: isError,
        isFetching: isFetching,
        isCached: data.isCached,
        error: error,
        fetch: fetch,
    }
}