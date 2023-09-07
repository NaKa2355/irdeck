import { RemotesList } from "../organisms/lists/remotesList";
import DrawerTemplate from "../templates/drawerTemplate";
import { ButtonsGrid } from "../organisms/grids/buttonsGrid";
import { AddRemoteModal } from "../organisms/modals/addRemoteModal";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

//hooks
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRemotes, useDevices, useAddRemoteModal, useEditRemoteModal, useAddRemoteModalState, useEditRemoteModalState, useRemoteState, useSelectedRemote } from "../../hooks";

//atoms
import { EditRemoteModal } from "../organisms/modals/editRemoteModal";

export function DrawerPage() {
  const remotesActions = useRemotes();
  const devicesActions = useDevices();
  const selectedRemote = useSelectedRemote();
  const {t} = useTranslation();
  const editRemoteModal = useEditRemoteModal();
  const editRemoteModalState = useEditRemoteModalState();
  const addRemoteModal = useAddRemoteModal();
  const addRemoteModalState = useAddRemoteModalState();
  const remotesState = useRemoteState();

  useEffect(() => {
    remotesActions.getRemotes();
    devicesActions.getDevices();
  }, []);

  return (
    <div>
      <DrawerTemplate
        title={selectedRemote?.name}
        drawer={
          <RemotesList/>
        }
        contents={
          <div>
            {remotesState.remotes.size !== 0 &&
              <ButtonsGrid />
            }
            {(remotesState.remotes.size === 0 && !remotesState.isLoading) &&
              <p>No Remotes</p>
            }
          </div>
        }
      />
      <Dialog open={addRemoteModalState.isOpen} onClose={addRemoteModal.close} fullWidth>
        <DialogTitle>{t("header.add_remote")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <AddRemoteModal />
        </DialogContent>
      </Dialog>

      <Dialog open={editRemoteModalState.isOpen} onClose={editRemoteModal.close} fullWidth>
        <DialogTitle>{t("header.add_remote")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <EditRemoteModal />
        </DialogContent>
      </Dialog>
    </div>
  );
}
