import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { AddButtonRequest } from "../../../hooks/useRemotes"

interface AddCustomFormProps {
  name: string
}

export function AddCustomForm(props: AddCustomFormProps) {
  const form = useFormContext()
  useEffect(() => {
    const buttons = new Array<AddButtonRequest>
    form.setValue(props.name, buttons)
  },[])
  return (<></>)
}