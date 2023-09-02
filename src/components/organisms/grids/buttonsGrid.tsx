import { Box, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { ButtonCard } from "./buttonCard";
import { useTranslation } from "react-i18next";
import { SignalWifi0Bar, Wifi } from "@mui/icons-material";
import { useButtonsGetter } from "../../../hooks/useButtonsGetter";
import { useEffect } from "react";
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

  useEffect(() => {
    buttonsGetter.fetch()
  }, [props.remoteId]);

  const onSetIrData = async (irData: IrData) => {
    if(buttonId) {
      await irSetter.setIr(buttonId, irData);
    }
    closeReceiveIrModal();
  }

  const onClickReceiveButton = (buttonId: string) => {
    openReceiveIrModal(buttonId);
  }

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
            deviceId={remote?.deviceId ?? ""}
            devices={devicesGetter.data}
            onClose={closeReceiveIrModal}
            onDone={onSetIrData} />
        </DialogContent>
      </Dialog>
      <Grid container spacing={2} columns={{ xs: 2, md: 3, xl: 4 }}>
        {cards}
      </Grid>
    </Box>
  )
}