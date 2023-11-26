import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial } from '@mui/material'
import { type Remote, RemoteType } from '../../../type/remote'
import { Add, ModeEdit, Thermostat, ToggleOff, TouchApp } from '@mui/icons-material'

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

interface RemotesListProps {
  remotes?: Remote[]
  isLoading?: boolean
  selectedRemoteId?: string
  onClick?: (remoteId: string) => void
  onAdd?: () => void
  onEdit?: (remoteId: string) => void
}

export function RemotesList (props: RemotesListProps): JSX.Element {
  return (
    <div>
      <List>
        {props.remotes?.map((remote) => (
            <ListItem
              key={remote.id}
              disablePadding
              secondaryAction={
                <IconButton
                  onClick={() => {
                    props.onEdit?.(remote.id)
                  }}
                  edge="end">
                  <ModeEdit />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => { props.onClick?.(remote.id) }}
                selected={props.selectedRemoteId === remote.id}
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
        onClick={props.onAdd}
        ariaLabel="irdeck"
        sx={{ position: 'fixed', bottom: 16, left: 16 }}
        icon={<Add />}
      >
      </SpeedDial>
    </div>
  )
}
