import { Device } from "../../../type/device.type";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormControl, FormLabel, MenuItem, Stack, TextField } from "@mui/material";
import { Select } from "../../atom/select";


type RemoteFormProps = {
  devices: Array<Device>
}

export function RemoteForm(props: RemoteFormProps) {
  const { t } = useTranslation();
  const form = useFormContext();
  const deviceMenu = props.devices.map((device) => {
    return (
      <MenuItem value={device.id}>{device.name}</MenuItem>
    )
  })

  return (
    <Stack spacing={2}>
      <FormControl>
        <FormLabel>{t("label.name")}</FormLabel>
        <TextField placeholder={t("label.name") ?? ""} {...form.register("name")} />
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.ir_sending_device")}</FormLabel>
        <Select name="deviceId" control={form.control}>
          {deviceMenu}
        </Select>
      </FormControl>
    </Stack>
  )
}
