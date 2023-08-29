import { useState } from "react";

export function useModal<T>():
[[boolean, T | undefined], [(props:T) => void, () => void]] {
    let [props, setProps] = useState<T>();
    let [opened, setOpen] = useState(false);

    const open = (props: T) => {
        setProps(props)
        setOpen(true);
    }

    const close = () => {
        setOpen(false);
    }

    return [[opened, props], [open, close]]
}