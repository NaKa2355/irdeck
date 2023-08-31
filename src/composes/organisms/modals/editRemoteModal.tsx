//types
import { Remote } from "../../../type/remote"
import { Device } from "../../../type/device.type"
//organisms
import { RemoteForm } from "../forms/remoteForm"
import { useTranslation } from "react-i18next"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Button, Grid, Stack } from "@mui/material"
import { useRemoteEditor } from "../../../hooks/useRemoteEditor"
import { useRemoteDelter } from "../../../hooks/useRemoteDeleter"

interface EditRemoteFormData {
  name: string,
  deviceId: string,
}


interface EditRemoteModalProps {
  devices: Map<string, Device>
  remote?: Remote
  onClose: () => void
  onDelete?: (remoteId: string) => void
}

export function EditRemoteModal(props: EditRemoteModalProps) {
  const { t } = useTranslation();
  const remoteEditor = useRemoteEditor();
  const remoteDeleter = useRemoteDelter();

  const form = useForm<EditRemoteFormData>({
    defaultValues: {
      name: props.remote?.name,
      deviceId: props.remote?.deviceId,
    }
  });

  const deleteRemote = async () => {
    await remoteDeleter.delete(props.remote?.id ?? "");
    props.onClose();
    props.onDelete?.(props.remote?.id ?? "");
  }

  const submit: SubmitHandler<EditRemoteFormData> = formData => {
    if (props.remote === undefined) {
      return;
    }
    remoteEditor.edit(props.remote.id, formData.name, formData.deviceId).then(props.onClose);
  };

  let devicesCanSend = Array.from(props.devices.values()).filter((device) => {
    if (device.canSend) {
      return device
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <Stack spacing={2}>
          <RemoteForm
            devices={devicesCanSend}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={deleteRemote}
            >delete
            </Button>
            <Button
              variant="contained"
              type="submit">
              {t("button.done")}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  )
}