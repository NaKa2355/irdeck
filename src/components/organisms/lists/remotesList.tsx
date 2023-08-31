import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial } from "@mui/material";
import { RemoteType } from "../../../type/remote";
import { Add, ModeEdit, Thermostat, ToggleOff, TouchApp } from "@mui/icons-material";
import { useRemotesGetter } from "../../../hooks/useRemotesGetter";
import { AddRemoteModal } from "../modals/addRemoteModal";
import { EditRemoteModal } from "../modals/editRemoteModal";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../hooks/useModal";
import { useDevicesGetter } from "../../../hooks/useDevicesGetter";
import { useEffect, useState } from "react";

interface Props {
  onRemoteSelected?: (remoteId: string) => void,
  onClick?: (remoteId: string) => void, 
}

function RemoteIcon(props: { remoteType: RemoteType }) {
  switch (props.remoteType) {
    case RemoteType.Button:
      return (<TouchApp />);
    case RemoteType.Toggle:
      return (<ToggleOff />);
    case RemoteType.Thermostat:
      return (<Thermostat />);
    default:
      return (<></>)
  }
}

export function RemotesList(props: Props) {
  const { t } = useTranslation();

  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();

  const [selectedRemote, setSelectedRemote] = useState<string | undefined>(undefined);

  const [[addRemoteModalOpend], [openAddRemoteModal, closeAddRemoteModal]] = useModal<void>()
  const [[editRemoteModalOpend, editTargetRemoteId], [openEditRemoteModal, closeEditRemoteModal]] = useModal<string>()

  if ((!remotesGetter.isCached && remotesGetter.isFetching) || (!devicesGetter.isCached && devicesGetter.isFetching)) {
    <CircularProgress />
  }

  useEffect(() => {
    if(selectedRemote) {
      props.onRemoteSelected?.(selectedRemote);
    }
  }, [selectedRemote]);

  const selectRemote = (remoteId: string) => {
    setSelectedRemote(remoteId);
  }

  const selectFirstRemote = () => {
    const remotes = Array.from(remotesGetter.data).filter(remote => remote[0] != selectedRemote);
    const firstRemote = remotes.at(0);
    if (firstRemote) {
      selectRemote(firstRemote[0]);
    } else {
      setSelectedRemote(undefined);
    }
  }

  if (selectedRemote == undefined && remotesGetter.isCached && remotesGetter.data.size != 0) {
    selectFirstRemote();
  }

  return (
    <div>
      <List>
        {
          Array.from(remotesGetter.data).map(([id, remote]) => (
            <ListItem
              key={id}
              disablePadding
              secondaryAction={
                <IconButton
                  onClick={() => { openEditRemoteModal(id); }}
                  edge="end">
                  <ModeEdit />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => { selectRemote(remote.id) }}
                selected={selectedRemote == remote.id}
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
        onClick={() => { openAddRemoteModal() }}
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, left: 16 }}
        icon={<Add />}
      >
      </SpeedDial>

      <Dialog open={addRemoteModalOpend} onClose={closeAddRemoteModal} fullWidth>
        <DialogTitle>{t("header.add_remote")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <AddRemoteModal
            onClose={closeAddRemoteModal}
            onAdd={selectRemote}
            devices={devicesGetter.data}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editRemoteModalOpend} onClose={closeEditRemoteModal} fullWidth>
        <DialogTitle>{t("header.edit")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <EditRemoteModal
            onDelete={(remoteId) => {
              if(selectedRemote == remoteId) {
                selectFirstRemote();
              }
            }}
            remote={remotesGetter.data.get(editTargetRemoteId ?? "")}
            onClose={closeEditRemoteModal}
            devices={devicesGetter.data}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}