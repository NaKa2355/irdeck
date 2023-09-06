//types
//organisms
import { Alert, Button, FormControl, FormHelperText, FormLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { EditRemoteModalAtom } from "../../../recoil/atoms/editRemoteModal"
import { useEditRemoteModal } from "../../../hooks/useEditRemoteModal"

//hooks

import { useTranslation } from "react-i18next"
import { useRemotes } from "../../../hooks/useRemotes"
import { useRecoilValue } from "recoil"

export function EditRemoteModal() {
  const { t } = useTranslation();
  const remotesActions = useRemotes();
  const modalState = useRecoilValue(EditRemoteModalAtom);
  const modal = useEditRemoteModal();

  const deviceMenu = Array.from(modalState.devices).map(([, device]) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  });

  const deleteRemote = async () => {
    await remotesActions.deleteRemote(modalState.remoteId);
    modal.close();
  }

  const submit = async () => {
    await modal.submit();
    modal.close();
  };

  return (
    <Stack spacing={2}>
      {modalState.isError && (
        <Alert severity="error">
          {t("error.unknown")}
        </Alert>
      )}

      <FormControl error={modalState.nameValidationError.isError}>
        <FormLabel>{t("label.name")}</FormLabel>
        <TextField
          error={modalState.nameValidationError.isError}
          defaultValue={modalState.name}
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
          onChange={
            (e) => modal.onDeviceChanged(e.target.value as string)
          }
          defaultValue={modalState.deviceId}>
          {deviceMenu}
        </Select>
      </FormControl>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="contained"
          onClick={deleteRemote}
          color="error"
        >
          {t("button.delete")}
        </Button>
        <Button
          disabled={!modalState.canSubmit}
          onClick={submit}
          variant="contained"
          type="submit">
          {t("button.done")}
        </Button>
      </Stack>
    </Stack>
  )
}