import { useState } from 'react'

interface Validation {
  isInvailed: boolean
  errorMessage: string
}
export type Validator = <V>(value: V) => Validation
type Handler = (name: string) => (value: any) => void

export const useForm = <F extends object>(props: {
  initialFormData: F
  validators: Record<string, Validator | undefined>
  serverSideValidation?: Record<string, Validation & { onCleanup: () => void } | undefined>
}): [{
    formData: F
    validation: Record<string, Validation | undefined>
  },
  {
    handleChange: Handler
    handleChangeWithEvent: Handler
    canSubmit: () => boolean
    setValidationError: (name: string, errorMessage: string) => void
  }] => {
  const [formData, setFormData] = useState<F>(props.initialFormData)
  const [clientSideValidations, setValidation] = useState<Record<string, Validation | undefined>>({})

  const computeValidation = (): Record<string, Validation | undefined> => {
    const validation: Record<string, Validation | undefined> = {}
    for (const key of Object.keys(clientSideValidations)) {
      const clientSideValidation = clientSideValidations[key]
      const serverSideValidation = props.serverSideValidation?.[key]
      const isClientSideInvailed = clientSideValidation?.isInvailed ?? false
      const isServerSideInvailed = serverSideValidation?.isInvailed ?? false
      const clientSideErrorMessage = clientSideValidation?.errorMessage ?? ''
      const serveSideErrorMessage = serverSideValidation?.errorMessage ?? ''
      validation[key] = {
        isInvailed: isClientSideInvailed || isServerSideInvailed,
        errorMessage: (clientSideErrorMessage !== '') ? clientSideErrorMessage : serveSideErrorMessage
      }
    }
    return validation
  }

  const validation = computeValidation()

  const setValidationError = (name: string, errorMessage: string): void => {
    setValidation({
      ...clientSideValidations,
      [name]: {
        isInvailed: true,
        errorMessage
      }
    })
  }

  const canSubmit = (): boolean => {
    let canSubmit = true
    for (const key of Object.keys(formData)) {
      canSubmit = canSubmit && !(props.validators[key]?.((formData as Record<string, any>)[key]).isInvailed ?? false)
    }
    return canSubmit
  }

  const handleChange = (name: string): (value: any) => void => {
    return (value: any) => {
      const serverSideValidation = props.serverSideValidation?.[name]
      if (serverSideValidation?.isInvailed ?? false) {
        serverSideValidation?.onCleanup()
      }
      setValidation({
        ...clientSideValidations,
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
