import { type Validator } from '../hooks'

export const remoteNameValidator: Validator = (remoteName: any) => {
  if (typeof remoteName !== 'string') {
    return {
      isInvailed: false,
      errorMessage: ''
    }
  }
  if (remoteName.length === 0) {
    return {
      isInvailed: true,
      errorMessage: 'error.remote_name_required'
    }
  }
  if (remoteName.length > 15) {
    return {
      isInvailed: true,
      errorMessage: 'error.remote_name_length'
    }
  }
  return {
    isInvailed: false,
    errorMessage: ''
  }
}
