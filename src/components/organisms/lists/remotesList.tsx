import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, SpeedDial } from "@mui/material";
import { RemoteType } from "../../../type/remote";
import { Add, ModeEdit, Thermostat, ToggleOff, TouchApp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {  useState } from "react";
import { useRecoilValue } from "recoil";
import { remotesAtom } from "../../../recoil/atoms/remotes";
import { selectedRemoteAtom } from "../../../recoil/atoms/selectedRemote";
import { devicesAtom } from "../../../recoil/atoms/devices";
import { useAddRemoteModal } from "../../../hooks/useAddRemoteModal";
import { useEditRemoteModal } from "../../../hooks/useEditRemoteModal";
import { useRemoteSelector } from "../../../hooks/useRemoteSelector";

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

export function RemotesList() {
  const { t } = useTranslation();

  const remotesAtomValue = useRecoilValue(remotesAtom);
  const selectedRemote = useRecoilValue(selectedRemoteAtom);
  const remoteSelector = useRemoteSelector();
  const devices = useRecoilValue(devicesAtom);
  const addRemoteModal = useAddRemoteModal();
  const editRemoteModal = useEditRemoteModal();
  const [isRemoteNotExists, setIsRemoteIsNotExist] = useState(false);
  const [isDeviceCanSendNotFound, setIsDeviceCanSendNotFound] = useState(false);

  if ((!remotesAtomValue.isCached && remotesAtomValue.isLoading) || (!devices.isCached && devices.isLoading)) {
    <CircularProgress />
  }

  const onClickAddRemoteButton = () => {
    addRemoteModal.open();
  };

  const onClickEditRemoteButton = (remoteId: string) => {
    editRemoteModal.open(remoteId);
  };

  return (
    <div>
      <List>
        {
          Array.from(remotesAtomValue.remotes).map(([id, remote]) => (
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
                onClick={() => {
                  remoteSelector.selectRemote(remote);
                }}
                selected={selectedRemote === remote}
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