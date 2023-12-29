import { Avatar, Grid, Menu, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector, pushButtonStateSelector } from '../../ducks/buttons/selector'
import { learnIrModalOpened } from '../../ducks/ui/leanIrModal'
import { pushButtonRequested } from '../../ducks/buttons'
import { type Button } from '../../type/button'
import { AvatarTextCard } from '../monecules/avatarTextCard'
import { IconWifi, IconWifiOff } from '@tabler/icons-react'
import { selectedRemoteIdSelector } from '../../ducks/remotes'
import { RemoteType } from '../../type/remote'
import { ComponentSwitcher } from '../../utils/memoComponentWithId'

interface ButtonCardProps {
  button: Button
}

const ButtonCard: React.FC<ButtonCardProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpend = Boolean(anchorEl)
  const dispatch = useDispatch()
  const pushButtonStatus = useSelector(pushButtonStateSelector(props.button.id))
  const isLoading = pushButtonStatus?.status === 'pending'
  const { t } = useTranslation()

  const translateButtonName = (name: string, tag: string): string => {
    if (name === 'push' || name === 'on' || name === 'off') {
      return t('button.' + name)
    }
    if (tag === RemoteType.Thermostat) {
      // get tmep type (h: heating, c: cooling)
      const type = name.slice(0, 1)
      if (type !== 'h' && type !== 'c') {
        return name
      }
      const temp = name.slice(1)
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
      title={translateButtonName(props.button.name, props.button.tag)}
      isLoading={isLoading}
      menu={menu}
      avatar={
        <Avatar
          sx={{
            width: 30,
            height: 30,
            color: 'text.secondary',
            backgroundColor: 'background.paper'
          }}
        >
          {props.button.hasIrData ? <IconWifi /> : <IconWifiOff />}
        </Avatar>
      }
      onCardClicked={onClick}
      onKebabMenuClicked={handleMenuClick}
    />
  )
}

const buttonsGridSwitcher = ComponentSwitcher()

const ButtonsGridById = React.memo(function ButtonsGridById (props: { remoteId: string }) {
  const buttons = useSelector(buttonsSelector(props.remoteId))
  const cards = buttons?.map((button: Button) => {
    return (
      <Grid item xs={1} key={button.id} >
        <ButtonCard button={button} />
      </Grid>
    )
  })

  return (
    <Grid container spacing={2} columns={{ xs: 2, sm: 3, md: 2, lg: 5, xl: 5 }}>
      {cards}
    </Grid>
  )
})

export const ButtonsGrid = React.memo(function ButtonsGrid () {
  const selectedRemote = useSelector(selectedRemoteIdSelector)
  return buttonsGridSwitcher(
    selectedRemote ?? '',
    <ButtonsGridById remoteId={selectedRemote ?? ''} />
  )
})
