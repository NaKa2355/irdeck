import { Grid } from "@mui/material";
import { ButtonCard } from "./buttonCard";
import { Button } from "../../../type/button";
import { useTranslation } from "react-i18next";
import { SignalWifi0Bar, Wifi } from "@mui/icons-material";

type ButtonsGridProps = {
  buttons: Map<string, Button>
  onClickReceiveButton?: (buttonId: string) => void,
  onClickSendButton?: (ButtonId: string) => void,
  onClick?: (buttonId: string) => void,
  isLoading?: boolean,
}


export function ButtonsGrid(props: ButtonsGridProps) {
  const { t } = useTranslation();
  const cards = Array.from(props.buttons).map(([id, button]) => (
    <Grid item xs={1}>
      <ButtonCard
        id={id}
        name={t(`button.${button.name}`) ?? button.name}
        hasIrData={button.hasIrData}
        icon={button.hasIrData ? <Wifi/> : <SignalWifi0Bar/>}
        onClick={props.onClick}
        onClickReceive={props.onClickReceiveButton}
        onClickSend={props.onClickSendButton}
      />
    </Grid>
  ));

  return (
      <Grid container spacing={2} columns={{ xs: 2, sm: 3, md: 4 }}>
        {cards}
      </Grid>
    
  )
}