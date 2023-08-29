import { useEffect, useState } from "react";
import { useButton } from "../../hooks/useButtons";
import { useSearchParams } from "react-router-dom";
import { ReceiveIrModal } from "../organisms/modals/receiveIrModal";
import { useModal } from "../../hooks/useModal";
import { useDevices } from "../../hooks/useDevices";
import { useIrSender } from "../../hooks/useIrSender";
import { useRemote } from "../../hooks/useRemotes";
import { ListTemplate } from "../templates/listTemplate";
import { IrData } from "../../type/irdata.type";
import { useTranslation } from "react-i18next";
import { ButtonsGrid } from "../organisms/grids/buttonsGrid";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { RemoteType } from "../../type/remote";

export function ButtonsListPage() {
  const button = useButton()
  const [searchParams] = useSearchParams();
  const [devices, getDevices] = useDevices();
  const [isLoading, setIsLoading] = useState(true);
  const [remote, getRemote] = useRemote();
  const [sendIr] = useIrSender()
  const [[opened, buttonId], [openReceiveIrModal, closeReceiveIrModal]] = useModal<string>();
  const remoteId = searchParams.get("id") as string;
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      await getDevices();
      await getRemote(remoteId);
      await button.get(remoteId);
      window.setTimeout(() => {
        setIsLoading(false);
      })
    })()
  }, []);

  const onSetIrData = (irData: IrData) => {
    button.setIr(remoteId, buttonId as string, irData).then(() => {
      closeReceiveIrModal();
    })
  }

  const onSendIr = async (buttonId: string) => {
    const irData = await button.getIr(remoteId, buttonId)
    await sendIr(remote?.deviceId ?? "", irData);
  }

  const onBack = () => {
    history.back();
  }

  return (
    <Box>
      <Dialog
        open={opened}
        onClose={closeReceiveIrModal}
        fullWidth PaperProps={{ sx: { height: '500px' } }}>
        <DialogTitle>{t("header.receive_ir")}</DialogTitle>
        <DialogContent>
          <ReceiveIrModal
            deviceId={remote?.deviceId ?? ""}
            devices={devices}
            onClose={closeReceiveIrModal}
            onDone={onSetIrData} />
        </DialogContent>
      </Dialog>

      <ListTemplate
        title={remote?.name ?? ""}

        backButton
        onBack={onBack}
        buttonName={t("button.add")}
        disableButton={remote?.tag != RemoteType.Custom}
        isLoading={isLoading}
        list={
          <ButtonsGrid
            buttons={button.buttons}
            onClickReceiveButton={openReceiveIrModal}
            onClickSendButton={onSendIr}
          />
        }
      />
    </Box>
  );
}
