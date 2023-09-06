import { useRecoilState } from "recoil";
import { devicesAtom } from "../recoil/atoms/devices";
import * as api from "../api";

export function useDevices() {
    const [devicesAtomData, setDevices] = useRecoilState(devicesAtom);

    const getDevices = async ()=> {
        setDevices({
            ...devicesAtomData,
            isLoading: true,
        });
        const result = await api.getDevices();
        if(result.isError) {
            setDevices({
                ...devicesAtomData,
                isLoading: false,
                isError: true,
                error: result.error,
            });
            return;
        }
        setDevices({
            ...devicesAtomData,
            isCached: true,
            isLoading: false,
            isError: false,
            devices: result.data,
        });
    }
    
    return {
        getDevices: getDevices,
    }
}
