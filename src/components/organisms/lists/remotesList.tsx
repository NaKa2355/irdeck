import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial } from '@mui/material'
import { RemoteType } from '../../../type/remote'
import { Add, ModeEdit, Thermostat, ToggleOff, TouchApp } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { remoteSelector, selectedRemoteSelector } from '../../../ducks/remotes/selector'
import { remoteSelected } from '../../../ducks/remotes'
import { fetchButtons } from '../../../ducks/buttons'
import { useEffect } from 'react'

function RemoteIcon (props: { remoteType: RemoteType }): JSX.Element {
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

export function RemotesList (): JSX.Element {
  const remotes = useSelector(remoteSelector)
  const dispatch = useDispatch()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const onEdit = (remoteId: string): void => {
  }
  const onClick = (remoteId: string): void => {
    dispatch(remoteSelected({ remoteId }))
  }

  useEffect(() => {
    if (selectedRemote === null) {
      return
    }
    dispatch(fetchButtons({
      remoteId: selectedRemote
    }))
  }, [selectedRemote])

  const onAdd = (): void => {}

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
