import { Alert, Box, Dialog, DialogContent, DialogTitle, Grid, Snackbar } from "@mui/material";
import { ButtonCard } from "./buttonCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { ReceiveIrModal } from "../modals/receiveIrModal";
import { IrData } from "../../../type/irdata.type";
import { useRecoilValue } from "recoil";
import { selectedRemoteIdAtom } from "../../../recoil/atoms/selectedRemoteId";
import { buttonsAtom } from "../../../recoil/atoms/buttons";
import { useButtons } from "../../../hooks/useButtons";
import { remotesAtom } from "../../../recoil/atoms/remotes";
import { devicesCanReceiveSelector } from "../../../recoil/selector/devicesCanReceive";


type ButtonsGridProps = {
  onClickReceiveButton?: (buttonId: string) => void,
  onClick?: (buttonId: string) => void,
  isLoading?: boolean,
}

export function ButtonsGrid(props: ButtonsGridProps) {
  const { t } = useTranslation();
  const [[opened, buttonId], [openReceiveIrModal, closeReceiveIrModal]] = useModal<string>();
  const selectedRemoteId = useRecoilValue(selectedRemoteIdAtom);
  const buttons = useRecoilValue(buttonsAtom(selectedRemoteId));
  const buttonsAction = useButtons(selectedRemoteId);
  const remotes = useRecoilValue(remotesAtom);
  const devicesCanReceive = useRecoilValue(devicesCanReceiveSelector);
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false);

  useEffect(() => {
    buttonsAction.getButtons();
  }, [selectedRemoteId]);

  const onSetIrData = async (irData: IrData) => {
    if (buttonId) {
      await buttonsAction.setIrData(buttonId, irData);
    }
    closeReceiveIrModal();
  };

  const onClickReceiveButton = (id: string) => {
    openReceiveIrModal(id);
  }

  const cards = Array.from(buttons.buttons).map(([id, button]) => (
    <Grid item xs={1} key={id}>
      <ButtonCard
        button={button}
        remoteId={selectedRemoteId}
        onClick={props.onClick}
        onClickReceive={onClickReceiveButton}
      />
    </Grid>
  ));

  const remote = remotes.remotes.get(selectedRemoteId);

  return (
    <Box>
      <Dialog
        open={opened}
        onClose={closeReceiveIrModal}
        fullWidth>
        <DialogTitle>{t("header.receive_ir")}</DialogTitle>
        <DialogContent>
          <ReceiveIrModal
            sendDeviceId={remote?.deviceId ?? ""}
            devicesCanReceive={devicesCanReceive}
            onClose={closeReceiveIrModal}
            onDone={onSetIrData} />
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={{ xs: 2, md: 3, xl: 4 }}>
        {cards}
      </Grid>

      <Snackbar
        open={isDeviceCanReceiveNotFound}
        autoHideDuration={6000}
        security="error"
        onClose={() => {setIsDeviceCanReceiveNotFound(false)}}
      >
        <Alert severity="error">{t("error.devices_can_receive_not_found")}</Alert>
      </Snackbar>
    </Box>
  )
}