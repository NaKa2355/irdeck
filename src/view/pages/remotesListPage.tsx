//react
import { useEffect, useState } from "react";

//hooks
import { useDevices } from "../../hooks/useDevices";
import { useRemotes } from "../../hooks/useRemotes";
import { useModal } from "../../hooks/useModal";
import { useNavigate } from "react-router-dom";

//templates
import { ListTemplate } from "../templates/listTemplate";

//organisms
import { AddRemoteModal } from "../organisms/modals/addRemoteModal";
import { EditRemoteModal } from "../organisms/modals/editRemoteModal";

//libs
import { useTranslation } from "react-i18next";
import { RemotesGrid } from "../organisms/lists/remoteGrid";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

export function RemoteListPage() {
  const remote = useRemotes()
  const [devices, getDevs] = useDevices();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  const [[addRemoteModalOpend], [openAddRemoteModal, closeAddRemoteModal]] = useModal<void>()
  const [[editRemoteModalOpend, editTargetRemoteId], [openEditRemoteModal, closeEditRemoteModal]] = useModal<string>()
  const { t } = useTranslation();

  useEffect(() => {
    getDevs();
    remote.get().then(() => {
      setIsLoading(false)
    });
  }, []);

  const route = (appId: string) => {
    navigate(`/remote?id=${appId}`)
  }

  const onDelete = (remoteId: string) => {
    const res = confirm(t("label.confirm_delete") ?? "")
    if (res) {
      remote.delete(remoteId)
    }
  }


  return (
    <div>
      <Dialog open={addRemoteModalOpend} onClose={closeAddRemoteModal} fullWidth>
        <DialogTitle>{t("header.add_remote")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <AddRemoteModal
            onClose={closeAddRemoteModal}
            devices={devices}
            onAdd={remote.add}
          />

        </DialogContent>
      </Dialog>

      <Dialog open={editRemoteModalOpend} onClose={closeEditRemoteModal} fullWidth>
        <DialogTitle>{t("header.edit")}</DialogTitle>
        <DialogContent>
          <Box height={20}></Box>
          <EditRemoteModal
            remote={remote.remotes.get(editTargetRemoteId ?? "")}
            onClose={closeEditRemoteModal}
            devices={devices}
            onEdit={remote.edit}
          />
        </DialogContent>
      </Dialog>

      <ListTemplate
        isLoading={isLoading}
        title={t("header.remotes")}
        buttonName={t("button.add")}
        onClick={openAddRemoteModal}
        list={
          <RemotesGrid
            onDelete={onDelete}
            onEdit={openEditRemoteModal}
            remotes={remote.remotes}
            onClick={route}
          />
        }
      />
    </div>
  );
}
