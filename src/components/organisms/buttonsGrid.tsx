import { Alert, Box, Grid, Snackbar } from '@mui/material'
import { ButtonCard } from '../monecules/buttonCard'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector } from '../../ducks/buttons/selector'
import { snackBarShown } from '../../ducks/ui'
import { learnIrModalOpened } from '../../ducks/ui/leanIrModal'

export const ButtonsGrid = (): JSX.Element => {
  const { t } = useTranslation()
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false)
  const buttons = useSelector(buttonsSelector)
  const dispatch = useDispatch()
  const onClickReceiveButton = (remoteId: string, buttonId: string): void => {
    dispatch(learnIrModalOpened({
      remoteId,
      buttonId
    }))
  }
  const onCardClick = (): void => {
    dispatch(snackBarShown({
      severity: 'error',
      message: 'hello!'
    }))
  }
  const cards = buttons?.map((button) => (
    <Grid item xs={1} key={button.id}>
      <ButtonCard
        button={button}
        onClick={onCardClick}
        onClickReceive={onClickReceiveButton}
        isLoading={false}
      />
    </Grid>
  ))

  return (
    <Box>
      <Grid container spacing={2} columns={{ xs: 2, md: 3, xl: 4 }}>
        {cards}
      </Grid>

      <Snackbar
        open={isDeviceCanReceiveNotFound}
        autoHideDuration={6000}
        security="error"
        onClose={() => { setIsDeviceCanReceiveNotFound(false) }}
      >
        <Alert severity="error">{t('error.devices_can_receive_not_found')}</Alert>
      </Snackbar>
    </Box>
  )
}
