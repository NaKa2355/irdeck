import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { AddButtonRequest } from "../../../hooks/useRemotes"
import { RemoteType } from "../../../type/remote"

interface AddButtonFormProps {
  name: string
}

function getButtons(): Array<AddButtonRequest> {
  const buttons = new Array<AddButtonRequest>;
  buttons.push({
    name: "push",
    tag: RemoteType.Button,
  });
  return buttons;
}

export function AddButtonForm(props: AddButtonFormProps) {
  const form = useFormContext();
  useEffect(() => {
    form.setValue(props.name, getButtons());
  }, [])
  return (<></>)
}