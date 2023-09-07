import { Alert, Box, Dialog, DialogContent, DialogTitle, Grid, Snackbar } from "@mui/material";
import { ButtonCard } from "./buttonCard";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { ReceiveIrModal } from "../modals/receiveIrModal";
import { IrData } from "../../../type/irdata.type";
import { useRecoilValue } from "recoil";
import { useButtons } from "../../../hooks/useButtons";
import { devicesCanReceiveSelector } from "../../../recoil/selector/devicesCanReceive";
import { useButtonsState, useSelectedRemote } from "../../../hooks";


type ButtonsGridProps = {
  onClickReceiveButton?: (buttonId: string) => void,
  onClick?: (buttonId: string) => void,
  isLoading?: boolean,
}

export function ButtonsGrid(props: ButtonsGridProps) {
  const { t } = useTranslation();
  const [[opened, buttonId], [openReceiveIrModal, closeReceiveIrModal]] = useModal<string>();
  const selectedRemote = useSelectedRemote();
  const buttonsState = useButtonsState(selectedRemote);
  const buttonsAction = useButtons(selectedRemote?.id ?? "");
  const devicesCanReceive = useRecoilValue(devicesCanReceiveSelector);
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false);

  const onSetIrData = async (irData: IrData) => {
    if (buttonId) {
      await buttonsAction.setIrData(buttonId, irData);
    }
    closeReceiveIrModal();
  };

  const onClickReceiveButton = (id: string) => {
    openReceiveIrModal(id);
  }

  const cards = Array.from(buttonsState.buttons).map(([id, button]) => (
    <Grid item xs={1} key={id}>
      <ButtonCard
        button={button}
        remoteId={selectedRemote?.id ?? ""}
        onClick={props.onClick}
        onClickReceive={onClickReceiveButton}
      />
    </Grid>
  ));

  return (
    <Box>
      <Dialog
        open={opened}
        onClose={closeReceiveIrModal}
        fullWidth>
        <DialogTitle>{t("header.receive_ir")}</DialogTitle>
        <DialogContent>
          <ReceiveIrModal
            sendDeviceId={selectedRemote?.deviceId ?? ""}
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