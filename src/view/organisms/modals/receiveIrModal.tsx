import useStateMachine, { t } from "@cassiozen/usestatemachine";
import { IconAlertCircle, IconCheck, IconDeviceRemote, IconHourglassLow, IconWifi } from "@tabler/icons-react";
import { useState } from "react";
import { useIrReceiver } from "../../../hooks/useIrReceiver";
import { Device } from "../../../type/device.type";
import { RpcError, StatusCode } from "grpc-web";
import { IrData } from "../../../type/irdata.type";
import { useIrSender } from "../../../hooks/useIrSender";
import { useTranslation } from "react-i18next";
import { Select, Box, Button, FormControl, FormLabel, Grid, MenuItem, Stack, Typography, SelectChangeEvent, DialogContent, DialogTitle, CircularProgress, Dialog, Container } from "@mui/material";

interface ReceiveIrErrorViewProps {
  onCancel: () => void
  onRetry: () => void
}

function ReceiveIrErrorView(props: ReceiveIrErrorViewProps) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item>
          <Typography color="red">
            <IconAlertCircle size={100} stroke={"1px"} />
          </Typography>
        </Grid>
      </Grid>
      <Typography align="center" fontWeight="bold">Receive Faild</Typography>
      <Button variant="outlined" onClick={props.onCancel}>
        {t("button.cancel")}
      </Button>
      <Button variant="contained" onClick={props.onRetry}>
        {t("button.retry")}
      </Button>
    </Stack>
  )
}

interface ReceivingIrViewProps {
  onLoad?: () => void,
  onCancel: () => void
}

function ReceivingIrView(props: ReceivingIrViewProps) {
  const { t } = useTranslation();
  return (
    <Grid container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ height: "100%" }}
    >
      <Grid item />
      <Grid item>
        <Stack spacing={2}>
          <Grid item container direction="row" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Grid>
          <Typography align="center" fontWeight="bold">{t("label.receiving")}</Typography>
        </Stack>
      </Grid>
      <Grid>
        <Stack>
          <Button variant="outlined" onClick={props.onCancel}>
            {t("button.cancel")}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

interface ReceiveIRSuccessfulViewProps {
  onTest: () => Promise<void>,
  onRetry: () => void,
  onDone: () => void
}

function ReceiveIRSuccessfulView(props: ReceiveIRSuccessfulViewProps) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false)

  const send = () => {
    setSending(true)
    props.onTest()
      .then(() => {
        setSending(false)
      })
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ height: "100%" }}
    >
      <Grid item />

      <Grid item>
        <Stack>
          <Grid container direction="row" justifyContent="center" alignItems="center" >
            <Grid item>
              <Typography color="green">
                <IconCheck size={100} stroke={"1px"} />
              </Typography>
            </Grid>
          </Grid>
          <Typography align="center" fontWeight="bold">{t("label.success")}</Typography>
        </Stack>
      </Grid>

      <Grid item>
        <Stack spacing={2}>

          <Button
            variant="outlined"
            onClick={send}
          >
            {t("button.receiving_test")}
          </Button>

          <Button
            variant="outlined"
            onClick={props.onRetry}
          >
            {t("button.retry")}
          </Button>

          <Button variant="contained" onClick={props.onDone}>
            {t("button.done")}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

interface ReceiveIrTimeOutViewProps {
  onCancel: () => void,
  onRetry: () => void
}

function ReceiveIrTimeOutView(props: ReceiveIrTimeOutViewProps) {
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ height: "100%" }}>
      <Grid item />
      <Grid item>
        <Grid container direction="row" justifyContent="center" alignItems="center" >
          <Grid item>
            <Stack>
              <Typography color="text.secondary">
                <IconHourglassLow size={100} stroke={"1px"} />
              </Typography>
              <Typography align="center" fontWeight="bold">{t("label.timeout")}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Stack spacing={2}>
          <Button variant="outlined" onClick={props.onCancel}>
            {t("button.cancel")}
          </Button>
          <Button variant="contained" onClick={props.onRetry}>
            {t("button.retry")}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

interface ReceiveIrViewProps {
  devices: Map<string, Device>
  onCancel: () => void,
  onReceive: (deviceId: string) => void
}

function ReceiveIrView(props: ReceiveIrViewProps) {
  const { t } = useTranslation();
  const devicesCanReceive = Array.from(props.devices.values()).filter((device) => {
    return device.canReceive
  })

  const [deviceId, setDeviceId] = useState<string | null>(devicesCanReceive[0].id)

  const receive = () => {
    if (deviceId != null) {
      props.onReceive(deviceId)
    }
  }

  const onDeviceSelected = (e: SelectChangeEvent) => {
    const deviceId = e.target.value as string;
    setDeviceId(deviceId);
  }

  const devicesItem = devicesCanReceive.map((device) => {
    return (<MenuItem value={device.id}>{device.name}</MenuItem>)
  })

  return (
    <Grid container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ height: "100%" }}
    >
      <Grid item />
      <Grid item>
        <Grid container direction="row" justifyContent="center" alignItems="center" >
          <Grid item>
            <Typography color="text.secondary">
              <IconWifi size={100} stroke={"1px"} />
            </Typography>
            <Typography color="text.secondary">
              <IconDeviceRemote size={100} stroke={"1px"} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("label.ir_receiving_device")}</FormLabel>
            <Select
              value={deviceId ?? ""}
              onChange={onDeviceSelected}
            >
              {devicesItem}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={props.onCancel}>
            {t("button.cancel")}
          </Button>

          <Button
            variant="contained"
            onClick={receive}>
            {t("button.receive")}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

interface ReceiveIrModalProps {
  onClose: () => void
  onDone: (irData: IrData) => void
  devices: Map<string, Device>
  deviceId: string
}

export function ReceiveIrModal(props: ReceiveIrModalProps) {
  const [sendIr] = useIrSender();
  const [receiveIr] = useIrReceiver();
  const tr = useTranslation();

  const [state, send] = useStateMachine({
    schema: {
      events: {
        RECEIVE: t<{ deviceId: string }>(),
        SUCCESS: t<{ irData: IrData }>()
      }
    },
    initial: 'standby',
    states: {
      standby: {
        on: {
          RECEIVE: 'receiving'
        }
      },

      receiving: {
        on: {
          FAIL: 'failed',
          SUCCESS: 'successful',
          TIMEOUT: 'timeouted'
        },

        effect({ event }) {
          receiveIr(event.deviceId)
            .then((irData) => {
              send({ type: "SUCCESS", irData: irData as IrData })
            })
            .catch((e) => {
              let err = e as RpcError
              if (err.code === StatusCode.DEADLINE_EXCEEDED) {
                send("TIMEOUT")
                return;
              }
              send("FAIL")
            })
        }
      },

      successful: {
        on: {
          RETRY: 'standby',
        }
      },

      timeouted: {
        on: {
          RETRY: 'standby',
        }
      },

      failed: {
        on: {
          RETRY: 'standby'
        },
        effect() {
          console.log("faild")
        }
      }
    },
  });

  const cancel = () => {
    props.onClose()
  }

  const test = async () => {
    if (state.event.type === 'SUCCESS') {
      await sendIr(props.deviceId, state.event.irData)
    }
  }

  const done = () => {
    if (state.event.type === 'SUCCESS') {
      props.onDone(state.event.irData)
    }
  }

  return (
    <Container sx={{ height: "100%" }}>
      {state.value === "standby" && (
        <ReceiveIrView
          devices={props.devices}
          onCancel={cancel}
          onReceive={(deviceId) => send({ type: "RECEIVE", deviceId: deviceId })}
        />
      )}

      {state.value === "receiving" && (
        <ReceivingIrView
          onCancel={cancel}
        />
      )}

      {state.value === "successful" && (
        <ReceiveIRSuccessfulView
          onDone={done}
          onRetry={() => { send("RETRY") }}
          onTest={test} />
      )}

      {state.value === "failed" && (
        <ReceiveIrErrorView
          onCancel={cancel}
          onRetry={() => { send("RETRY") }}
        />

      )}

      {state.value === "timeouted" && (
        <ReceiveIrTimeOutView
          onCancel={cancel}
          onRetry={() => { send("RETRY") }}
        />
      )}
    </Container>
  )
}