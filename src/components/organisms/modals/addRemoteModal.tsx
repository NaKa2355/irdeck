//types
import { RemoteType } from "../../../type/remote";

//organisms
import { AddThermostatForm } from "../forms/addThermostatForm";

//conmponents
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, SelectChangeEvent, Alert, TextField, FormHelperText } from "@mui/material";
import { AddRemoteModalAtom } from "../../../recoil/atoms/addRemoteModal";

//hooks
import { useAddRemoteModal } from "../../../hooks/useAddRemoteModal";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function AddRemoteModal() {
  const [remoteType, setRemoteType] = useState<RemoteType>(Object.values(RemoteType)[0]);
  const modal = useAddRemoteModal();
  const modalState = useRecoilValue(AddRemoteModalAtom);
  const { t } = useTranslation();

  let remoteTypesItems = Object.values(RemoteType).map((remoteType) => {
    return (
      <MenuItem key={remoteType} value={remoteType}>{t(`remote_types.${remoteType}`)}</MenuItem>
    )
  });

  if (modalState.isOpen === undefined) {
    return (<></>);
  }

  const changeForm = (e: SelectChangeEvent<RemoteType>) => {
    const remoteType = e.target.value as RemoteType
    setRemoteType(remoteType);
    modal.onRemoteTypeChanged(remoteType);
  }

  const deviceMenu = Array.from(modalState.devices).map(([, device]) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  });

  const submit = async () => {
    await modal.submit();
    modal.close();
  }

  return (
    <Stack spacing={2}>
      {modalState.isError && (
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

      <FormControl error={modalState.nameValidationError.isError}>
        <FormLabel>{t("label.name")}</FormLabel>
        <TextField
          error={modalState.nameValidationError.isError}
          placeholder={t("label.name") ?? ""}
          onChange={(e) => {
            modal.onNameChanged(e.target.value);
          }}
        />
        <FormHelperText>
          {modalState.nameValidationError.isError ? t(modalState.nameValidationError.message) : ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.ir_sending_device")}</FormLabel>
        <Select
          defaultValue={modalState.deviceId}
          name="deviceId"
          onChange={(e) => { modal.onDeviceChanged(e.target.value as string) }}>
          {deviceMenu}
        </Select>
      </FormControl>

      {remoteType === RemoteType.Thermostat &&
        <AddThermostatForm name="buttons" />
      }

      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item>
          <Button
            disabled={!modalState.canSubmit}
            onClick={submit}
            variant="contained"
            type="submit">
            {t("button.add")}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
};