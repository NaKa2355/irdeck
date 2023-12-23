import { useState } from 'react'

interface Validation {
  isInvailed: boolean
  errorMessage: string
}
export type Validator = <V>(value: V) => Validation
type Handler = (name: string) => (value: any) => void

export const useForm = <F>(props: { initialFormData: F, validators: Record<string, Validator | undefined> }):
[
  { formData: F, validation: Record<string, Validation | undefined> },
  {
    handleChange: Handler
    handleChangeWithEvent: Handler
    canSubmit: () => boolean
    setValidationError: (name: string, errorMessage: string) => void
  }] => {
  const [formData, setFormData] = useState<F>(props.initialFormData)
  const [validation, setValidation] = useState<Record<string, Validation | undefined>>({})

  const setValidationError = (name: string, errorMessage: string): void => {
    setValidation({
      ...validation,
      [name]: {
        isInvailed: true,
        errorMessage
      }
    })
  }

  const canSubmit = (): boolean => {
    let canSubmit = true
    for (const key of Object.keys(props.validators)) {
      canSubmit = canSubmit && !(props.validators[key]?.((formData as Record<string, any>)[key]).isInvailed ?? false)
    }
    return canSubmit
  }

  const handleChange = (name: string) => {
    return (value: any) => {
      setValidation({
        ...validation,
        [name]: props.validators[name]?.(value)
      })
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleChangeWithEvent = (name: string) => {
    return (e: any) => {
      handleChange(name)(e.target.value)
    }
  }

  return [{ formData, validation }, { handleChange, handleChangeWithEvent, canSubmit, setValidationError }]
}
