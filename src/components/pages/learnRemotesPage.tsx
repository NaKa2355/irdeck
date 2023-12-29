import React from 'react'

// templates
import { LearnRemotesTemplate } from '../templates/learnRemotesTemplate'

// hooks
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { clearPostRemoteStatus } from '../../ducks/remotes'
import { addRemoteModalOpened, drawerClosed, drawerOpened } from '../../ducks/ui'
import { drawerSelector } from '../../ducks/ui/selector'
import { RemotesList } from '../organisms/remoteList'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { remoteSelector, selectedRemoteIdSelector } from '../../ducks/remotes/selector'

export const LearnRemotesPage: React.FC = () => {
  const dispatch = useDispatch()
  const selectedRemoteId = useSelector(selectedRemoteIdSelector)
  const selectedRemote = useSelector(remoteSelector(selectedRemoteId))
  const { t } = useTranslation()
  const isDrawerOpen = useSelector(drawerSelector)
  const drawerListTitle = t('header.remotes')

  const onAddButtonClick = (): void => {
    dispatch(clearPostRemoteStatus())
    dispatch(addRemoteModalOpened())
  }

  const onDrawerClose = (): void => {
    dispatch(drawerClosed())
  }

  const onIconClick = (): void => {
    dispatch(drawerOpened())
  }

  return (
    <LearnRemotesTemplate
      title={selectedRemote?.name}
      drawerTitle={drawerListTitle}
      isDrawerOpen={isDrawerOpen}
      buttonsCards={
        <ButtonsGrid></ButtonsGrid>
      }
      remotesListItems={
        <RemotesList></RemotesList>
      }
      onIconClick={onIconClick}
      onDrawerClose={onDrawerClose}
      onAddButtonClick={onAddButtonClick}
    />
  )
}
