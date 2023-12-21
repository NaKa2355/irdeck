import { z } from 'zod'
import { type Validator } from '../hooks'

export const remoteNameSchema = z.string()
  .min(1, {
    message: 'error.remote_name_required'
  })
  .max(15, {
    message: 'error.remote_name_length'
  })

export const remoteNameValidator: Validator = (remoteName: any) => {
  if (typeof remoteName !== 'string') {
    return {
      isInvailed: false,
      errorMessage: ''
    }
  }
  const result = remoteNameSchema.safeParse(remoteName)
  return {
    isInvailed: !result.success,
    errorMessage: !result.success ? result.error.errors[0].message : ''
  }
}
