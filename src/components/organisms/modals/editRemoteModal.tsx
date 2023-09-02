//types
import { Remote } from "../../../type/remote"
import { Device } from "../../../type/device.type"
//organisms
import { RemoteForm } from "../forms/remoteForm"
import { useTranslation } from "react-i18next"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Alert, Button, Grid, Stack } from "@mui/material"
import { useRemoteEditor } from "../../../hooks/useRemoteEditor"
import { useRemoteDelter } from "../../../hooks/useRemoteDeleter"
import { RpcError, StatusCode } from "grpc-web"
import { useState } from "react"

interface EditRemoteFormData {
  name: string,
  deviceId: string,
}


interface EditRemoteModalProps {
  devicesCanSend: Array<Device>
  remote?: Remote
  onClose: () => void
  onDelete?: (remoteId: string) => void
  onRemoteNotFound?: () => void
}

export function EditRemoteModal(props: EditRemoteModalProps) {
  const { t } = useTranslation();
  const remoteEditor = useRemoteEditor();
  const remoteDeleter = useRemoteDelter();
  const [postErr, setPostErr] = useState(false);

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
    (async () => {
      if (props.remote === undefined) {
        return;
      }
      try {
        await remoteEditor.edit(props.remote.id, formData.name, formData.deviceId);
        props.onClose();
      } catch (err) {
        const rpcErr = err as RpcError;
        if (rpcErr.code === StatusCode.NOT_FOUND) {
          props.onDelete?.(props.remote.id ?? "");
          props.onClose();
          props.onRemoteNotFound?.();
          return;
        }
        setPostErr(true);
      }
    })();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <Stack spacing={2}>
          {postErr && (
            <Alert severity="error">
              {t("error.unknown")}
            </Alert>
          )}
          <RemoteForm
            devices={props.devicesCanSend}
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
              color="error"
            >
              {t("button.delete")}
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