import { Alert, Snackbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { snackBarHidden, snackbarSelector } from '../../ducks/ui'
import { useTranslation } from 'react-i18next'
import React from 'react'

export const AppSnackbar: React.FC = () => {
  const { t } = useTranslation()
  const snackbar = useSelector(snackbarSelector)
  const dispatch = useDispatch()
  const onSnackbarClose = (): void => {
    dispatch(snackBarHidden())
  }
  return (
    <Snackbar
      open={snackbar.isShown}
      onClose={onSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={6000}>
      <Alert onClose={onSnackbarClose}
        severity={snackbar.severity}
        sx={{ width: '100%' }}>
        {t(snackbar.message)}
      </Alert>
    </Snackbar>
  )
}
