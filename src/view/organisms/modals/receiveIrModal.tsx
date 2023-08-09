import useStateMachine, { t } from "@cassiozen/usestatemachine";
import { IconAlertCircle, IconCheck, IconDeviceRemote, IconHourglassLow, IconWifi } from "@tabler/icons-react";
import { useState } from "react";
import { useIrReceiver } from "../../../hooks/useIrReceiver";
import { Device } from "../../../type/device.type";
import { RpcError, StatusCode } from "grpc-web";
import { IrData } from "../../../type/irdata.type";
import { useIrSender } from "../../../hooks/useIrSender";
import { useTranslation } from "react-i18next";
import { Select, Box, Button, FormControl, FormLabel, Grid, MenuItem, Stack, Typography, SelectChangeEvent, DialogContent, DialogTitle, CircularProgress, Dialog } from "@mui/material";

interface ReceiveIrErrorViewProps {
  visible?: boolean
  onCancel: () => void
  onRetry: () => void
}

function ReceiveIrErrorView(props: ReceiveIrErrorViewProps) {
  const { t } = useTranslation();
  if (!props.visible) return null

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
  visible?: boolean
  onLoad?: () => void,
  onCancel: () => void
}


function ReceivingIrView(props: ReceivingIrViewProps) {
  const { t } = useTranslation();
  if (!props.visible) return null
  return (
    <Grid container
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretch"
    >
      <Grid item>
        <Stack spacing={2} mt="20" mb="20">
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item>
              <CircularProgress />
            </Grid>
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
  visible?: boolean
  onTest: () => Promise<void>,
  onRetry: () => void,
  onDone: () => void
}

function ReceiveIRSuccessfulView(props: ReceiveIRSuccessfulViewProps) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false)

  if (!props.visible) return null

  const send = () => {
    setSending(true)
    props.onTest()
      .then(() => {
        setSending(false)
      })
  }

  return (
    <Stack spacing={2}>
      <Grid container direction="row" justifyContent="center" alignItems="center" >
        <Grid item>
          <Typography color="green">
            <IconCheck size={100} stroke={"1px"} />
          </Typography>
        </Grid>
      </Grid>

      <Typography align="center" fontWeight="bold">{t("label.success")}</Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={send}
          fullWidth
        >
          {t("button.receiving_test")}
        </Button>
        <Button
          variant="outlined"
          onClick={props.onRetry}
          fullWidth
        >
          {t("button.retry")}
        </Button>
      </Stack>
      <Button variant="contained" onClick={props.onDone}>
        {t("button.done")}
      </Button>
    </Stack>
  )
}

interface ReceiveIrTimeOutViewProps {
  visible?: boolean
  onCancel: () => void,
  onRetry: () => void
}

function ReceiveIrTimeOutView(props: ReceiveIrTimeOutViewProps) {
  const { t } = useTranslation();
  if (!props.visible) return null


  return (
    <Stack spacing={2}>
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


      <Button variant="outlined" onClick={props.onCancel}>
        {t("button.cancel")}
      </Button>
      <Button variant="contained" onClick={props.onRetry}>
        {t("button.retry")}
      </Button>
    </Stack>
  )
}

interface ReceiveIrViewProps {
  visible?: boolean
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

  if (!props.visible) return null

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
      justifyContent="space-evenly"
      alignItems="stretch"
      sx={{ height: 1 }}
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
    <Box>
      <ReceiveIrView
        visible={state.value === "standby"}
        devices={props.devices}
        onCancel={cancel}
        onReceive={(deviceId) => send({ type: "RECEIVE", deviceId: deviceId })} />

      <ReceivingIrView
        visible={state.value === "receiving"}
        onCancel={cancel}
      />

      <ReceiveIRSuccessfulView
        visible={state.value === 'successful'}
        onDone={done}
        onRetry={() => { send("RETRY") }}
        onTest={test} />

      <ReceiveIrErrorView
        visible={state.value === "failed"}
        onCancel={cancel}
        onRetry={() => { send("RETRY") }}
      />

      <ReceiveIrTimeOutView
        visible={state.value === "timeouted"}
        onCancel={cancel}
        onRetry={() => { send("RETRY") }}
      />
    </Box>
  )
}