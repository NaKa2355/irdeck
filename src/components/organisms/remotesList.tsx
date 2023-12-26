// types
import { RemoteType } from '../../type/remote'

// components
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'

// hooks
import { useDispatch, useSelector } from 'react-redux'

// redux
import { clearDeleteRemoteStatus, clearPatchRemoteStatus, clearPostRemoteStatus, remoteSelected, remotesSelector, selectedRemoteSelector } from '../../ducks/remotes'
import { addRemoteModalOpened, drawerClosed, editRemoteModalOpened } from '../../ducks/ui'
import { useEffect } from 'react'
import { IconAirConditioningDisabled, IconCircuitPushbutton, IconEdit, IconToggleLeft } from '@tabler/icons-react'

const RemoteIcon = (props: { remoteType: RemoteType }): JSX.Element => {
  let icon: JSX.Element
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

export const RemotesList = (): JSX.Element => {
  const remotes = useSelector(remotesSelector)
  const dispatch = useDispatch()
  const selectedRemote = useSelector(selectedRemoteSelector)

  useEffect(() => {
    if (selectedRemote !== null) {
      if (!remotes.includes(selectedRemote)) {
        dispatch(remoteSelected({
          remoteId: remotes.at(0)?.id ?? null
        }))
      }
    }
  }, [dispatch, remotes])

  const onEdit = (remoteId: string): void => {
    dispatch(clearPatchRemoteStatus())
    dispatch(clearDeleteRemoteStatus())
    dispatch(editRemoteModalOpened({ remoteId }))
  }
  const onClick = (remoteId: string): void => {
    dispatch(drawerClosed())
    dispatch(remoteSelected({ remoteId }))
  }

  const onAdd = (): void => {
    dispatch(clearPostRemoteStatus())
    dispatch(addRemoteModalOpened())
  }

  return (
    <div>
      <List>
        {remotes.map((remote) => (
          <ListItem
            sx={{
              padding: '5px',
              paddingLeft: 0
            }}
            key={remote.id}
            disablePadding
            secondaryAction={
              <IconButton
                onClick={() => {
                  onEdit(remote.id)
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
              selected={selectedRemote?.id === remote.id}
              onClick={() => { onClick(remote.id) }}
            >
              <ListItemIcon style={{ minWidth: '40px' }}>
                <RemoteIcon remoteType={remote.tag as RemoteType} />
              </ListItemIcon>
              <ListItemText primary={remote.name} />
            </ListItemButton>
          </ListItem>
        ))
        }
      </List>

      <SpeedDial
        onClick={onAdd}
        ariaLabel="irdeck"
        sx={{ position: 'fixed', bottom: 16, left: 16 }}
        icon={<Add />}
      >
      </SpeedDial>
    </div>
  )
}
