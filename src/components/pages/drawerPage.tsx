// templates
import DrawerTemplate from '../templates/drawerTemplate'

// organisms
import { RemotesList } from '../organisms/remotesList'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { AddRemoteModal } from '../organisms/addRemoteModal'
import { EditRemoteModal } from '../organisms/editRemoteModal'

// type
import { type AppDispatch } from '../../app/thunk'

// hooks
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// redux
import { fetchRemotes, selectedRemoteSelector } from '../../ducks/remotes'
import { fetchDevices } from '../../ducks/devices'
import { fetchButtons } from '../../ducks/buttons'
import { drawerClosed, drawerOpened, snackBarHidden, snackbarSelector } from '../../ducks/ui'
import { Alert, Snackbar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ReceiveIrModal } from '../organisms/receiveIrModal'
import { drawerSelector } from '../../ducks/ui/selector'

export const DrawerPage = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const snackbar = useSelector(snackbarSelector)
  const { t } = useTranslation()
  const isDrawerOpen = useSelector(drawerSelector)
  useEffect(() => {
    void dispatch(fetchRemotes())
    void dispatch(fetchDevices())
  }, [])

  useEffect(() => {
    void dispatch(fetchButtons({ remoteId: selectedRemote?.id ?? '' }))
  }, [selectedRemote])

  const onSnackbarClose = (): void => {
    dispatch(snackBarHidden())
  }

  const onDrawerClose = (): void => {
    dispatch(drawerClosed())
  }

  const onIconClick = (): void => {
    dispatch(drawerOpened())
  }

  return (
    <div>
      <DrawerTemplate
        title={selectedRemote?.name}
        isDrawerOpen={isDrawerOpen}
        drawer={
          <RemotesList />
        }
        onIconClick={onIconClick}
        onDrawerClose={onDrawerClose}
        contents={
          <div>
            <ButtonsGrid />
          </div>
        }
      />

      <AddRemoteModal />
      <EditRemoteModal />
      <ReceiveIrModal />

      <Snackbar
        open={snackbar.isShown}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000}>
        <Alert onClose={onSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {t(snackbar.message)}
        </Alert>
      </Snackbar>
    </div>
  )
}
