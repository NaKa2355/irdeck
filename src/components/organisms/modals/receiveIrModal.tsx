import useStateMachine, { t } from "@cassiozen/usestatemachine";
import { IconAlertCircle, IconCheck, IconDeviceRemote, IconHourglassLow, IconWifi } from "@tabler/icons-react";
import { useState } from "react";
import { useIrReceiver } from "../../../hooks/useIrReceiver";
import { Device } from "../../../type/device.type";
import { RpcError, StatusCode } from "grpc-web";
import { IrData } from "../../../type/irdata.type";
import { useIrSender } from "../../../hooks/useIrSender";
import { useTranslation } from "react-i18next";
import { Select, Button, FormControl, FormLabel, Grid, MenuItem, Stack, Typography, SelectChangeEvent, CircularProgress, Box } from "@mui/material";

interface ReceiveIrErrorViewProps {
  onCancel: () => void
  onRetry: () => void
}

function ReceiveIrErrorView(props: ReceiveIrErrorViewProps) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography color="error.light" align="center">
        <IconAlertCircle size={100} stroke={"1px"} />
      </Typography>
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
    <Stack spacing={2}>
      <Grid
        paddingTop={2}
        container
        direction="row"
        justifyContent="center"
        alignItems="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={props.onCancel}>
        {t("button.cancel")}
      </Button>
    </Stack>
  )
}

interface ReceiveIRSuccessfulViewProps {
  onTest: () => Promise<void>,
  onRetry: () => void,
  onDone: () => void
}

function ReceiveIRSuccessfulView(props: ReceiveIRSuccessfulViewProps) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);

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
          <Typography color="success.light">
            <IconCheck size={100} stroke={"1px"} />
          </Typography>
        </Grid>
      </Grid>
      <Typography align="center" fontWeight="bold">{t("label.success")}</Typography>

      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={send}
        >
          {t("button.receiving_test")}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={props.onRetry}
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
  onCancel: () => void,
  onRetry: () => void
}

function ReceiveIrTimeOutView(props: ReceiveIrTimeOutViewProps) {
  const { t } = useTranslation();

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
  devicesCanReceive: Array<Device>
  onCancel: () => void,
  onReceive: (deviceId: string) => void
}

function ReceiveIrView(props: ReceiveIrViewProps) {
  const { t } = useTranslation();
  const [deviceId, setDeviceId] = useState<string | undefined>(props.devicesCanReceive.at(0)?.id)

  const receive = () => {
    if (deviceId) {
      props.onReceive(deviceId)
    }
  }

  const onDeviceSelected = (e: SelectChangeEvent) => {
    const deviceId = e.target.value as string;
    setDeviceId(deviceId);
  }

  const devicesItem = props.devicesCanReceive.map((device) => {
    return (<MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>)
  })

  return (
    <Stack spacing={2}>
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
  )
}

interface ReceiveIrModalProps {
  onClose: () => void
  onDone: (irData: IrData) => void
  devicesCanReceive: Array<Device>
  sendDeviceId: string
}

export function ReceiveIrModal(props: ReceiveIrModalProps) {
  const [sendIr] = useIrSender();
  const [receiveIr] = useIrReceiver();

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
      await sendIr(props.sendDeviceId, state.event.irData)
    }
  }

  const done = () => {
    if (state.event.type === 'SUCCESS') {
      props.onDone(state.event.irData)
    }
  }

  return (
    <Box>
      {state.value === "standby" && (
        <ReceiveIrView
          devicesCanReceive={props.devicesCanReceive}
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
    </Box>
  )
}