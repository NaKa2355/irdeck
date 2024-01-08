import { CircularProgress, Stack } from '@mui/material'

export const LoadingRemotes = (): JSX.Element => {
  return (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress/>
    </Stack>
  )
}
