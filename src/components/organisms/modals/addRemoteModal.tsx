//react
import { useState } from "react";

//types
import { RemoteType } from "../../../type/remote";
import { Device } from "../../../type/device.type";

//organisms
import { RemoteForm } from "../forms/remoteForm";
import { AddThermostatForm } from "../forms/addThermostatForm";

//constants
import { useTranslation } from "react-i18next";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, SelectChangeEvent, Alert } from "@mui/material";
import { AddButtonForm } from "../forms/addButtonForm";
import { AddToggleForm } from "../forms/addToggleFrom";
import { RpcError, StatusCode } from "grpc-web";
import { useRemoteAdder, AddRemoteRequest } from "../../../hooks/useRemoteAdder";


export type AddRemoteModalProps = {
  onClose: () => void,
  onAdd?: (remoteId: string) => void,
  devicesCanSend: Array<Device>,
}

export function AddRemoteModal(props: AddRemoteModalProps) {
  const [remoteType, setRemoteType] = useState<RemoteType>(Object.values(RemoteType)[0]);
  const [postErr, setPostErr] = useState(false);
  const remoteAdder = useRemoteAdder();
  const { t } = useTranslation();

  const form = useForm<AddRemoteRequest>({
    defaultValues: {
      tag: remoteType,
      deviceId: props.devicesCanSend.at(0)?.id,
    }
  });

  const changeForm = (e: SelectChangeEvent<RemoteType>) => {
    const remoteType = e.target.value as RemoteType
    setRemoteType(remoteType);
  }

  const submit: SubmitHandler<AddRemoteRequest> = async (formData) => {
    formData.tag = remoteType
    try {
      const remoteId = await remoteAdder.add(formData);
      props.onClose();
      props.onAdd?.(remoteId);
    } catch (err) {
      const grpcErr = err as RpcError;
      if (grpcErr.code === StatusCode.ALREADY_EXISTS) {
        form.setError(
          "name",
          {
            type: "value",
            message: t("error.remote_name_already_exists") ?? ""
          })
        return;
      }
      console.log(err)
      setPostErr(true);
    }
  };

  let remoteTypesItems = Object.values(RemoteType).map((remoteType) => {
    return (
      <MenuItem key={remoteType} value={remoteType}>{t(`remote_types.${remoteType}`)}</MenuItem>
    )
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <Stack spacing={2}>
          {postErr && (
            <Alert severity="error">
              {t("error.unknown")}
            </Alert>
          )}
          <FormControl>
            <FormLabel>{t("label.type")}</FormLabel>
            <Select value={remoteType} onChange={changeForm} defaultValue={remoteType}>
              {remoteTypesItems}
            </Select>
          </FormControl>

          <RemoteForm
            devices={props.devicesCanSend}
          />

          {/* {remoteType === RemoteType.Custom &&
          <AddCustomForm name="buttons" />
        } */}

          {remoteType === RemoteType.Thermostat &&
            <AddThermostatForm name="buttons" />
          }

          {remoteType === RemoteType.Button &&
            <div>
              <AddButtonForm name="buttons" />
            </div>
          }

          {remoteType === RemoteType.Toggle &&
            <AddToggleForm name="buttons" />
          }

          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Button variant="contained" type="submit">{t("button.add")}</Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </FormProvider>
  )
}