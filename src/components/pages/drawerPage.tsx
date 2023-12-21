// templates
import DrawerTemplate from '../templates/drawerTemplate'

// organisms
import { RemotesList } from '../organisms/remotesList'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { AddRemoteModal } from '../organisms/addRemoteModal'
import { EditRemoteModal } from '../organisms/editRemoteModal'

// type
import { type Remote } from '../../type/remote'
import { type AppDispatch } from '../../app/thunk'

// hooks
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// redux
import { fetchRemotes, selectedRemoteSelector } from '../../ducks/remotes'
import { fetchDevices } from '../../ducks/devices'
import { fetchButtons } from '../../ducks/buttons'
import { snackBarHidden, snackbarSelector } from '../../ducks/ui'
import { Alert, Snackbar } from '@mui/material'

interface DrawerPageProps {
  selectedRemote?: Remote
  remotes?: Remote[]
  isFetchingRemote?: boolean
}

export const DrawerPage = (props: DrawerPageProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const snackbar = useSelector(snackbarSelector)
  useEffect(() => {
    void dispatch(fetchRemotes())
    void dispatch(fetchDevices())
  }, [])
  useEffect(() => {
    void dispatch(fetchButtons({ remoteId: selectedRemote ?? '' }))
  }, [selectedRemote])

  const onSnackbarClose = (): void => {
    dispatch(snackBarHidden())
  }
  return (
    <div>
      <DrawerTemplate
        title={props.selectedRemote?.name}
        drawer={
          <RemotesList />
        }
        contents={
          <div>
            <ButtonsGrid />
          </div>
        }
      />

      <AddRemoteModal />
      <EditRemoteModal />

      <Snackbar
        open={snackbar.isShown}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000}>
        <Alert onClose={onSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
