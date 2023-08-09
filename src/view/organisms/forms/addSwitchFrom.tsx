import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { AddButtonRequest } from "../../../hooks/useRemotes"
import { RemoteType } from "../../../type/remote"

interface AddSwitchFormProps {
  name: string
}

function getButtons(): Array<AddButtonRequest> {
  const buttons = new Array<AddButtonRequest>
  buttons.push({
    name: "on",
    tag: RemoteType.Toggle
    
  });
  buttons.push({
    name: "off",
    tag: RemoteType.Toggle
  })
  return buttons
}

export function AddSwitchForm(props: AddSwitchFormProps) {
  const form = useFormContext()
  form.setValue(props.name, getButtons())
  return (<></>)
}