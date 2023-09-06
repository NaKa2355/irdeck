import { RemotesList } from "../organisms/lists/remotesList";
import DrawerTemplate from "../templates/drawerTemplate";
import { ButtonsGrid } from "../organisms/grids/buttonsGrid";
import { AddRemoteModal } from "../organisms/modals/addRemoteModal";
import { AddRemoteModalAtom } from "../../recoil/atoms/addRemoteModal";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

//hooks
import { useEffect, useState } from "react";
import { useRemotes } from "../../hooks/useRemotes";
import { useRecoilValue } from "recoil";
import { useDevices } from "../../hooks/useDevices";
import { useAddRemoteModal } from "../../hooks/useAddRemoteModal";
import { useTranslation } from "react-i18next";
import { useEditRemoteModal } from "../../hooks/useEditRemoteModal";

//atoms
import { EditRemoteModalAtom } from "../../recoil/atoms/editRemoteModal";
import { remotesAtom } from "../../recoil/atoms/remotes";
import { EditRemoteModal } from "../organisms/modals/editRemoteModal";

export function DrawerPage() {
  const remotes = useRecoilValue(remotesAtom);
  const remotesActions = useRemotes();
  const devicesActions = useDevices();
  const [selectedRemoteId, selectRemote] = useState("");
  const {t} = useTranslation();
  const [isRemoteEmpty, setRemoteIsEmpty] = useState(false);
  const addRemoteModalState = useRecoilValue(AddRemoteModalAtom);
  const editRemoteModalState = useRecoilValue(EditRemoteModalAtom);
  const editRemoteModal = useEditRemoteModal();
  const addRemoteModal = useAddRemoteModal();

  useEffect(() => {
    remotesActions.getRemotes();
    devicesActions.getDevices();
  }, []);

  const onRemoteIsEmpty = () => {
    setRemoteIsEmpty(true);
  }

  return (
    <div>
      <DrawerTemplate
        title={remotes.remotes.get(selectedRemoteId)?.name ?? ""}
        drawer={
          <RemotesList
            onRemoteEmpty={onRemoteIsEmpty}
          />
        }
        contents={
          <div>
            {!isRemoteEmpty &&
              <ButtonsGrid />
            }
            {isRemoteEmpty &&
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
