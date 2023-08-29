import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SpeedDial } from "@mui/material";
import { Remote } from "../../../type/remote";
import { IconMail } from "@tabler/icons-react";
import { Add, ModeEdit } from "@mui/icons-material";
import { useRemotesGetter } from "../../../hooks/useRemotesGetter";
import { AddRemoteModal } from "../modals/addRemoteModal";
import { EditRemoteModal } from "../modals/editRemoteModal";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../hooks/useModal";
import { useDevicesGetter } from "../../../hooks/useDevicesGetter";

interface Props {
  remotes: Map<string, Remote>
}

export function RemotesList(props: Props) {
  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();

  const { t } = useTranslation();
  const [[addRemoteModalOpend], [openAddRemoteModal, closeAddRemoteModal]] = useModal<void>()
  const [[editRemoteModalOpend, editTargetRemoteId], [openEditRemoteModal, closeEditRemoteModal]] = useModal<string>()

  if ((!remotesGetter.isCached && remotesGetter.isFetching) || (!devicesGetter.isCached && devicesGetter.isFetching)) {
    <CircularProgress />
  }

  return (
    <div>
      <List>
        {
          Array.from(props.remotes).map(([id, remote]) => (
            <ListItem
              key={id}
              disablePadding
              secondaryAction={
                <IconButton 
                onClick={() => {openEditRemoteModal(id);}}
                edge="end">
                  <ModeEdit />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <IconMail />
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
            devices={devicesGetter.data}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editRemoteModalOpend} onClose={closeEditRemoteModal} fullWidth>
        <DialogTitle>{t("header.edit")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <EditRemoteModal
            remote={remotesGetter.data.get(editTargetRemoteId ?? "")}
            onClose={closeEditRemoteModal}
            devices={devicesGetter.data}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}