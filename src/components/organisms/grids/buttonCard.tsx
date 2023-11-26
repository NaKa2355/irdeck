import { Avatar, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AvatarTextCard } from '../../monecules/avatarTextCard'
import { type Button } from '../../../type/button'
import { SignalWifi0Bar, Wifi } from '@mui/icons-material'

interface ButtonCardProps {
  button: Button
  remoteId: string
  isLoading: boolean
  onClick?: (id: string) => void
  onClickReceive?: (id: string) => void
}

export function ButtonCard (props: ButtonCardProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpend = Boolean(anchorEl)
  const { t } = useTranslation()

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const onClick = (): void => {
    props.onClick?.(props.remoteId)
  }

  const onReceive = (): void => {
    props.onClickReceive?.(props.remoteId)
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
        {t('button.lean')}
      </MenuItem>
    </Menu>
  )

  return (
    <AvatarTextCard
      title={props.button.name}
      isLoading={props.isLoading}
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
