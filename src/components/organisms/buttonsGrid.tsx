import { Alert, Box, Grid, Snackbar } from '@mui/material'
import { ButtonCard } from '../monecules/buttonCard'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { buttonsSelector } from '../../ducks/buttons/selector'

export const ButtonsGrid = (): JSX.Element => {
  const { t } = useTranslation()
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false)
  const buttons = useSelector(buttonsSelector)

  const onClickReceiveButton = (id: string): void => {
    // openReceiveIrModal(id);
  }
  const onCardClick = (): void => {

  }
  const cards = buttons?.map((button) => (
    <Grid item xs={1} key={button.id}>
      <ButtonCard
        button={button}
        remoteId={''}
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
