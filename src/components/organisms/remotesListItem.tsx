import { type ReactNode } from 'react'

// types
import { type Remote, type RemoteId, RemoteType } from '../../type/remote'

// components
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'

// hooks
import { useDispatch } from 'react-redux'

// redux
import { clearDeleteRemoteStatus, clearPatchRemoteStatus, remoteSelected } from '../../ducks/remotes'
import { drawerClosed, editRemoteModalOpened } from '../../ducks/ui'
import { IconAirConditioningDisabled, IconCircuitPushbutton, IconEdit, IconToggleLeft } from '@tabler/icons-react'

const RemoteIcon = (props: { remoteType: RemoteType }): ReactNode => {
  let icon: ReactNode
  switch (props.remoteType) {
    case RemoteType.Button:
      icon = <IconCircuitPushbutton />
      break
    case RemoteType.Toggle:
      icon = <IconToggleLeft />
      break
    case RemoteType.Thermostat:
      icon = <IconAirConditioningDisabled />
      break
    default:
      icon = <></>
      break
  }
  return (
    <Typography color='text.secondary'>
      {icon}
    </Typography>
  )
}

interface RemotesListItemProps {
  remote: Remote
  selectedRemoteId?: RemoteId
  key: string
}

export const RemotesListItem = (props: RemotesListItemProps): ReactNode => {
  const dispatch = useDispatch()

  const onEdit = (remoteId: string): void => {
    dispatch(clearPatchRemoteStatus())
    dispatch(clearDeleteRemoteStatus())
    dispatch(editRemoteModalOpened({ remoteId }))
  }

  const onClick = (remoteId: string): void => {
    dispatch(drawerClosed())
    dispatch(remoteSelected({ remoteId }))
  }

  return (
    <ListItem
      sx={{
        padding: '5px'
      }}
      key={props.remote.id}
      disablePadding
      secondaryAction={
        <IconButton
          onClick={() => {
            onEdit(props.remote.id)
          }}
          edge="end"
        >
          <Typography color='text.secondary'>
            <IconEdit size='1.2em' />
          </Typography>
        </IconButton>
      }
    >
      <ListItemButton
        selected={props.selectedRemoteId === props.remote.id}
        onClick={() => { onClick(props.remote.id) }}
      >
        <ListItemIcon style={{ minWidth: '40px' }}>
          <RemoteIcon remoteType={props.remote.tag as RemoteType} />
        </ListItemIcon>
        <ListItemText primary={props.remote.name} />
      </ListItemButton>
    </ListItem>)
}
