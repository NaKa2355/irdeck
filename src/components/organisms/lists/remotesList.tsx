import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, SpeedDial } from "@mui/material";
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
  onRemoteEmpty?: () => void;
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

  const [[addRemoteModalOpend], [openAddRemoteModal, closeAddRemoteModal]] = useModal<void>();
  const [[editRemoteModalOpend, editTargetRemoteId], [openEditRemoteModal, closeEditRemoteModal]] = useModal<string>();
  const [isRemoteNotExists, setIsRemoteIsNotExist] = useState(false);
  const [isDeviceCanSendNotFound, setIsDeviceCanSendNotFound] = useState(false);

  if ((!remotesGetter.isCached && remotesGetter.isFetching) || (!devicesGetter.isCached && devicesGetter.isFetching)) {
    <CircularProgress />
  }

  useEffect(() => {
    if(selectedRemote) {
      props.onRemoteSelected?.(selectedRemote);
    } else {
      props.onRemoteEmpty?.();
    }
  }, [selectedRemote]);

  const selectRemote = (remoteId: string) => {
    setSelectedRemote(remoteId);
  }

  const devicesCanSend = Array.from(devicesGetter.data.values()).filter((device) => {
    if (device.canSend) {
      return device
    }
  });

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

  const onClickAddRemoteButton = () => {
    if(devicesCanSend.length === 0) {
      setIsDeviceCanSendNotFound(true);
      return;
    }
    openAddRemoteModal();
  };

  const onClickEditRemoteButton = (remoteId: string) => {
    if(devicesCanSend.length === 0) {
      setIsDeviceCanSendNotFound(true);
      return;
    }
    openEditRemoteModal(remoteId);
  };

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
                  onClick={() => {
                    onClickEditRemoteButton(id);
                  }}
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
        onClick={onClickAddRemoteButton}
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
            devicesCanSend={devicesCanSend}
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
            devicesCanSend={devicesCanSend}
            onRemoteNotFound={() => {
              setIsRemoteIsNotExist(true);
            }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={isRemoteNotExists}
        autoHideDuration={6000}
        security="error"
        onClose={() => {setIsRemoteIsNotExist(false)}}
      >
        <Alert severity="error">{t("error.remote_not_found")}</Alert>
      </Snackbar>

      <Snackbar
        open={isDeviceCanSendNotFound}
        autoHideDuration={6000}
        security="error"
        onClose={() => {setIsDeviceCanSendNotFound(false)}}
      >
        <Alert severity="error">{t("error.devices_can_send_not_found")}</Alert>
      </Snackbar>
    </div>
  )
}