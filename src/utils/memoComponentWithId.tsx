import { Box } from '@mui/material'
import { type ReactNode } from 'react'

export const ComponentSwitcher = (): (selectedKey: string, component: ReactNode) => ReactNode => {
  const components = new Map<string, ReactNode>()
  return (selectedKey, component) => {
    if (!components.has(selectedKey)) {
      components.set(selectedKey, component)
    }

    const switcher = Array.from(components.keys()).map((key) => {
      return (
        <Box key={key} sx={{ display: selectedKey === key ? 'inherit' : 'none' }}>
          {components.get(key) ?? <></>}
        </Box>
      )
    })
    return switcher
  }
}
