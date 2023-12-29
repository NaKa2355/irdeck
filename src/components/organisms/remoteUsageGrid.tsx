import React from 'react'
import { useSelector } from 'react-redux'
import { remotesSelector } from '../../ducks/remotes'
import { RemoteType } from '../../type/remote'
import { ButtonRemoteCard } from './buttonRemoteCard'
import { Grid } from '@mui/material'
import { ToggleRemoteCard } from './toggleRemoteCard'
import { ThermostatRemoteCard } from './thermostatRemoteCard'

export const RemoteUsageGrid: React.FC = React.memo(function RemoteUsageGrid () {
  const remotes = useSelector(remotesSelector)
  const cards = remotes.map((remote) => {
    switch (remote.tag) {
      case RemoteType.Button:
        return (
          <Grid xs={1} item key={remote.id}>
            <ButtonRemoteCard title={remote.name} />
          </Grid>
        )
      case RemoteType.Toggle:
        return (
          <Grid xs={1} item key={remote.id}>
            <ToggleRemoteCard title={remote.name} />
          </Grid>
        )
      case RemoteType.Thermostat:
        return (
          <Grid xs={1} item key={remote.id}>
            <ThermostatRemoteCard title={remote.name} />
          </Grid>
        )
      default:
        return <></>
    }
  })
  return (
    <Grid container spacing={2} columns={{ xs: 2, sm: 3, md: 3, lg: 5, xl: 5 }}>
      {cards}
    </Grid>
  )
})
