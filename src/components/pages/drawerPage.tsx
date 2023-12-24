// templates
import DrawerTemplate from '../templates/drawerTemplate'

// organisms
import { RemotesList } from '../organisms/remotesList'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { AddRemoteModal } from '../organisms/addRemoteModal'
import { EditRemoteModal } from '../organisms/editRemoteModal'

// hooks
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// redux
import { selectedRemoteSelector } from '../../ducks/remotes'

import { drawerClosed, drawerOpened, snackBarHidden, snackbarSelector } from '../../ducks/ui'
import { Alert, Snackbar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ReceiveIrModal } from '../organisms/receiveIrModal'
import { drawerSelector } from '../../ducks/ui/selector'
import { fetchRemoteRequested } from '../../ducks/remotes/fetchStateSlice'
import { fetchDevicesRequested } from '../../ducks/devices'

export const DrawerPage = (): JSX.Element => {
  const dispatch = useDispatch()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const snackbar = useSelector(snackbarSelector)
  const { t } = useTranslation()
  const isDrawerOpen = useSelector(drawerSelector)
  useEffect(() => {
    void dispatch(fetchDevicesRequested())
    void dispatch(fetchRemoteRequested())
  }, [])

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
            {selectedRemote !== null &&
              <ButtonsGrid />
            }
            {selectedRemote === null &&
              <p>no remotes</p>
            }
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
