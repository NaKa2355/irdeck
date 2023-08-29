//types
import { Remote } from "../../../type/remote"
import { Device } from "../../../type/device.type"
//organisms
import { RemoteForm } from "../forms/remoteForm"
import { useTranslation } from "react-i18next"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Button, Grid, Stack } from "@mui/material"
import { Title } from "@mui/icons-material"
import { useRemoteEditor } from "../../../hooks/useRemoteEditor"

interface EditRemoteFormData {
  name: string,
  deviceId: string,
}


interface EditRemoteModalProps {
  devices: Map<string, Device>
  remote?: Remote
  onClose: () => void
}

export function EditRemoteModal(props: EditRemoteModalProps) {
  const { t } = useTranslation();
  const remoteEditor = useRemoteEditor();

  const form = useForm<EditRemoteFormData>({
    defaultValues: {
      name: props.remote?.name,
      deviceId: props.remote?.deviceId,
    }
  })

  const submit: SubmitHandler<EditRemoteFormData> = formData => {
    if (props.remote === undefined) {
      return;
    }
    remoteEditor.edit(props.remote.id, formData.name, formData.deviceId).then(props.onClose);
  }

  let devicesCanSend = Array.from(props.devices.values()).filter((device) => {
    if (device.canSend) {
      return device
    }
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <Stack spacing={2}>
          <RemoteForm
            devices={devicesCanSend}
          />
          <Grid container
            direction="row"
            justifyContent="flex-end"
            alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                type="submit">
                {t("button.done")}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </FormProvider>
  )
}