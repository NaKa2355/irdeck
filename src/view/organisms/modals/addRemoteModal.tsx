//react
import { useState } from "react";

//types
import { RemoteType } from "../../../type/remote";
import { Device } from "../../../type/device.type";

//organisms
import { RemoteForm } from "../forms/remoteForm";
import { AddThermostatForm } from "../forms/addThermostatForm";

//constants
import { AddRemoteRequest } from "../../../hooks/useRemotes";
import { useTranslation } from "react-i18next";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, SelectChangeEvent } from "@mui/material";
import { AddButtonForm } from "../forms/addButtonForm";
import { AddSwitchForm } from "../forms/addSwitchFrom";
import { AddCustomForm } from "../forms/addCustonForm";


export type AddRemoteModalProps = {
  onClose: () => void,
  onAdd?: (req: AddRemoteRequest) => Promise<void>,
  devices: Map<string, Device>,
}

export function AddRemoteModal(props: AddRemoteModalProps) {
  const [remoteType, setRemoteType] = useState<RemoteType>(Object.values(RemoteType)[0]);
  const { t } = useTranslation();

  const form = useForm<AddRemoteRequest>({
    defaultValues: {
      deviceId: props.devices.keys().next().value
    }
  });

  const changeForm = (e: SelectChangeEvent<RemoteType>) => {
    const remoteType = e.target.value as RemoteType
    setRemoteType(remoteType);
  }

  const submit: SubmitHandler<AddRemoteRequest> = async (formData) => {
    formData.tag = remoteType
    await props.onAdd?.(formData)
      .then(props.onClose)
      .catch((err) => {
        console.log(err)
      });
  };

  let deviceCanSend = Array.from(props.devices.values()).filter((device) => {
    if (device.canSend) {
      return device
    }
  })

  let remoteTypesItems = Object.values(RemoteType).map((remoteType) => {
    return (
      <MenuItem value={remoteType}>{t(`remote_types.${remoteType}`)}</MenuItem>
    )
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("label.type")}</FormLabel>
            <Select value={remoteType} onChange={changeForm}>
              {remoteTypesItems}
            </Select>
          </FormControl>

          <RemoteForm
            devices={deviceCanSend}
          />

          {remoteType === RemoteType.Custom &&
            <AddCustomForm name="buttons" />
          }

          {remoteType === RemoteType.Thermostat &&
            <AddThermostatForm name="buttons" />
          }

          {remoteType === RemoteType.Button &&
            <AddButtonForm name="buttons" />
          }

          {remoteType === RemoteType.Toggle &&
            <AddSwitchForm name="buttons" />
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