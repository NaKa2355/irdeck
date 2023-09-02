import { Alert, Box, Dialog, DialogContent, DialogTitle, Grid, Snackbar } from "@mui/material";
import { ButtonCard } from "./buttonCard";
import { useTranslation } from "react-i18next";
import { useButtonsGetter } from "../../../hooks/useButtonsGetter";
import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { ReceiveIrModal } from "../modals/receiveIrModal";
import { useRemotesGetter } from "../../../hooks/useRemotesGetter";
import { useDevicesGetter } from "../../../hooks/useDevicesGetter";
import { useIrSetter } from "../../../hooks/useIrSetter";
import { IrData } from "../../../type/irdata.type";

type ButtonsGridProps = {
  onClickReceiveButton?: (buttonId: string) => void,
  onClick?: (buttonId: string) => void,
  isLoading?: boolean,
  remoteId: string,
}


export function ButtonsGrid(props: ButtonsGridProps) {
  const { t } = useTranslation();
  const [[opened, buttonId], [openReceiveIrModal, closeReceiveIrModal]] = useModal<string>();
  const buttonsGetter = useButtonsGetter(props.remoteId);
  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();
  const irSetter = useIrSetter(props.remoteId);
  const [isDeviceCanReceiveNotFound, setIsDeviceCanReceiveNotFound] = useState(false);

  useEffect(() => {
    buttonsGetter.fetch()
  }, [props.remoteId]);

  const onSetIrData = async (irData: IrData) => {
    if (buttonId) {
      await irSetter.setIr(buttonId, irData);
    }
    closeReceiveIrModal();
  };

  const devicesCanReceive = Array.from(devicesGetter.data.values()).filter((device) => {
    return device.canReceive
  });

  const onClickReceiveButton = (buttonId: string) => {
    if(devicesCanReceive.length === 0) {
      setIsDeviceCanReceiveNotFound(true);
      return;
    }
    openReceiveIrModal(buttonId);
  };

  const cards = Array.from(buttonsGetter.data).map(([id, button]) => (
    <Grid item xs={1} key={id}>
      <ButtonCard
        button={button}
        remoteId={props.remoteId}
        onClick={props.onClick}
        onClickReceive={onClickReceiveButton}
      />
    </Grid>
  ));

  const remote = remotesGetter.data.get(props.remoteId);

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