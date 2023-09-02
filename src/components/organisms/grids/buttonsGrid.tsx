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

type ButtonsGridProps = {
  onClickReceiveButton?: (buttonId: string) => void,
  onClickSendButton?: (ButtonId: string) => void,
  onClick?: (buttonId: string) => void,
  isLoading?: boolean,
  remoteId: string,
}


export function ButtonsGrid(props: ButtonsGridProps) {
  const { t } = useTranslation();
  const [[opened], [openReceiveIrModal, closeReceiveIrModal]] = useModal<string>();
  const buttonsGetter = useButtonsGetter(props.remoteId);
  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();

  useEffect(() => {
    buttonsGetter.fetch()
  }, [props.remoteId]);

  const onSetIrData = () => {

  }

  const onClickReceiveButton = (buttonId: string) => {
    openReceiveIrModal(buttonId);
  }

  const cards = Array.from(buttonsGetter.data).map(([id, button]) => (
    <Grid item xs={1} key={id}>
      <ButtonCard
        id={id}
        name={t(`button.${button.name}`) ?? button.name}
        hasIrData={button.hasIrData}
        icon={button.hasIrData ? <Wifi /> : <SignalWifi0Bar />}
        onClick={props.onClick}
        onClickReceive={onClickReceiveButton}
        onClickSend={props.onClickSendButton}
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