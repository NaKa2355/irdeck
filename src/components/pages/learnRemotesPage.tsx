import React from 'react'

// templates
import { LearnRemotesTemplate } from '../templates/learnRemotesTemplate'

// organisms
import { RemotesListItem } from '../organisms/remotesListItem'

// hooks
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { clearPostRemoteStatus, fetchRemoteStatusSelector, remotesSelector, selectedRemoteSelector } from '../../ducks/remotes'
import { addRemoteModalOpened, drawerClosed, drawerOpened } from '../../ducks/ui'
import { drawerSelector } from '../../ducks/ui/selector'
import { buttonsSelector, fetchButtonsStatusSelector } from '../../ducks/buttons/selector'
import { ButtonsGrid } from '../organisms/buttonsGrid'

export const LearnRemotesPage: React.FC = () => {
  const dispatch = useDispatch()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const { t } = useTranslation()
  const isDrawerOpen = useSelector(drawerSelector)
  const fetchRemotesStatus = useSelector(fetchRemoteStatusSelector)
  const fetchButtonsStatus = useSelector(fetchButtonsStatusSelector(selectedRemote?.id ?? ''))
  const isRemoteLoading = fetchRemotesStatus.isFetching && !fetchRemotesStatus.isCached
  const isButtonLoading = (fetchButtonsStatus?.isFetching ?? true) && (!(fetchButtonsStatus?.isCached ?? false))
  const isContentLoading = isRemoteLoading && isButtonLoading
  const drawerListTitle = t('header.remotes')
  const buttons = useSelector(buttonsSelector(selectedRemote?.id))
  const remotes = useSelector(remotesSelector)

  const remotesListItems = remotes.map(remote => {
    return (<RemotesListItem selectedRemoteId={selectedRemote?.id} key={remote.id} remote={remote} />)
  })

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
      isContentLoading={isContentLoading}
      isDrawerLoading={isRemoteLoading}
      title={selectedRemote?.name}
      drawerTitle={drawerListTitle}
      isDrawerOpen={isDrawerOpen}
      remotesListItems={remotesListItems}
      onIconClick={onIconClick}
      onDrawerClose={onDrawerClose}
      buttonsCards={
        <ButtonsGrid buttons={buttons}></ButtonsGrid>
      }
      onAddButtonClick={onAddButtonClick}
    />
  )
}
