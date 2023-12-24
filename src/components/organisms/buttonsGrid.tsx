import { Alert, Avatar, Box, Grid, Menu, MenuItem, Snackbar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector, pushButtonStateSelector } from '../../ducks/buttons/selector'
import { learnIrModalOpened } from '../../ducks/ui/leanIrModal'
import { pushButtonRequested } from '../../ducks/buttons'
import { type Button } from '../../type/button'
import { AvatarTextCard } from '../monecules/avatarTextCard'
import { SignalWifi0Bar, Wifi } from '@mui/icons-material'

interface ButtonCardProps {
  button: Button
}

const ButtonCard = (props: ButtonCardProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpend = Boolean(anchorEl)
  const dispatch = useDispatch()
  const pushButtonStatus = useSelector(pushButtonStateSelector(props.button.id))
  const isLoading = pushButtonStatus?.status === 'pending'
  const { t } = useTranslation()

  const translateButtonName = (name: string): string => {
    const tempRegex = /^(?<type>h|c)(?<temp>[0-9]+\.?[0-9]?)/
    if (name === 'push' || name === 'on' || name === 'off') {
      return t('button.' + name)
    }
    if (tempRegex.test(name)) {
      const result = tempRegex.exec(name)
      const type = result?.groups?.type
      const temp = result?.groups?.temp
      return t('button.' + type, { temp })
    }
    return name
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const onClick = (): void => {
    if (props.button.hasIrData) {
      void dispatch(pushButtonRequested({
        buttonId: props.button.id
      }))
    }
  }

  const onReceive = (): void => {
    handleClose()
    dispatch(learnIrModalOpened({
      remoteId: props.button.remoteId,
      buttonId: props.button.id
    }))
  }

  const menu = (
    <Menu
      open={menuOpend}
      anchorEl={anchorEl}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button'
      }}
    >
      <MenuItem onClick={onReceive}>
        {t('button.learn')}
      </MenuItem>
    </Menu>
  )

  return (
    <AvatarTextCard
      title={translateButtonName(props.button.name)}
      isLoading={isLoading}
      menu={menu}
      avatar={
        <Avatar
          sx={{
            width: 30,
            height: 30,
            color: 'text.secondary',
            backgroundColor: 'background.default',
            border: 1,
            borderColor: 'divider'
          }}
        >
          {props.button.hasIrData ? <Wifi /> : <SignalWifi0Bar />}
        </Avatar>
      }
      onCardClicked={onClick}
      onKebabMenuClicked={handleMenuClick}
    />
  )
}

export const ButtonsGrid = (): JSX.Element => {
  const { t } = useTranslation()
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false)
  const buttons = useSelector(buttonsSelector)
  const cards = buttons?.map((button) => (
    <Grid item xs={1} key={button.id}>
      <ButtonCard
        button={button}
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
