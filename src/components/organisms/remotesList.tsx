// types
import { RemoteType } from '../../type/remote'
import { type AppDispatch } from '../../app/thunk'

// components
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial } from '@mui/material'
import { Add, ModeEdit, Thermostat, ToggleOff, TouchApp } from '@mui/icons-material'

// hooks
import { useDispatch, useSelector } from 'react-redux'

// redux
import { clearDeleteRemoteStatus, clearPatchRemoteStatus, clearPostRemoteStatus, remoteSelected, remotesSelector, selectedRemoteSelector } from '../../ducks/remotes'
import { addRemoteModalOpened, editRemoteModalOpened } from '../../ducks/ui'

const RemoteIcon = (props: { remoteType: RemoteType }): JSX.Element => {
  switch (props.remoteType) {
    case RemoteType.Button:
      return (<TouchApp />)
    case RemoteType.Toggle:
      return (<ToggleOff />)
    case RemoteType.Thermostat:
      return (<Thermostat />)
    default:
      return (<></>)
  }
}

export const RemotesList = (): JSX.Element => {
  const remotes = useSelector(remotesSelector)
  const dispatch = useDispatch<AppDispatch>()
  const selectedRemote = useSelector(selectedRemoteSelector)

  const onEdit = (remoteId: string): void => {
    dispatch(clearPatchRemoteStatus())
    dispatch(clearDeleteRemoteStatus())
    dispatch(editRemoteModalOpened({ remoteId }))
  }
  const onClick = (remoteId: string): void => {
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
            key={remote.id}
            disablePadding
            secondaryAction={
              <IconButton
                onClick={() => {
                  onEdit(remote.id)
                }}
                edge="end">
                <ModeEdit />
              </IconButton>
            }
          >
            <ListItemButton
              selected={selectedRemote === remote.id}
              onClick={() => { onClick(remote.id) }}
            >
              <ListItemIcon>
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
