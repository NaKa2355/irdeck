import { Button, CircularProgress, type ButtonProps as MuiButtonProps } from '@mui/material'

type LoadingButtonProps = MuiButtonProps & {
  loading?: boolean
  children: string
}

export const LoadingButton = (props: LoadingButtonProps): JSX.Element => {
  return (
    <Button {...props} disabled={props.loading}>
      <div style={{ position: 'relative', width: 'fit-content' }}>
        {(Boolean((props.loading ?? false))) &&
          <div style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <CircularProgress size='1em' />
          </div>
        }
        {props.children}
      </div>
    </Button>
  )
}
