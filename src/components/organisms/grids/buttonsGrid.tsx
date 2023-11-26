import { Alert, Box, Grid, Snackbar } from '@mui/material'
import { ButtonCard } from './buttonCard'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { type Button } from '../../../type/button'

interface ButtonsGridProps {
  onClickReceiveButton?: (buttonId: string) => void
  onClick?: (buttonId: string) => void
  isLoading?: boolean
  buttons?: Button[]
}

export function ButtonsGrid (props: ButtonsGridProps): JSX.Element {
  const { t } = useTranslation()
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false)

  const onClickReceiveButton = (id: string): void => {
    // openReceiveIrModal(id);
  }

  const cards = props.buttons?.map((button) => (
    <Grid item xs={1} key={button.id}>
      <ButtonCard
        button={button}
        remoteId={''}
        onClick={props.onClick}
        onClickReceive={onClickReceiveButton}
        isLoading={false}
      />
    </Grid>
  ))

  return (
    <Box>
      {/* <Dialog
        open={opened}
        onClose={closeReceiveIrModal}
        fullWidth>
        <DialogTitle>{t("header.receive_ir")}</DialogTitle>
        <DialogContent>
          <ReceiveIrModal
            sendDeviceId={selectedRemote?.deviceId ?? ""}
            devicesCanReceive={devicesCanReceive}
            onClose={closeReceiveIrModal}
            onDone={onSetIrData} />
        </DialogContent>
      </Dialog> */}
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
