import { useTranslation } from 'react-i18next'
import { TempSlider } from '../../monecules/tempSlider'
import { Stack, FormControl, FormLabel, MenuItem, Select } from '@mui/material'

interface AddThermostatFormProps {
  onScaleChanged?: (scale: string) => void
  onHeatTempScalesChanged?: (range: [number, number]) => void
  onCoolTempScalesChanged?: (range: [number, number]) => void
}

export function AddThermostatForm (props: AddThermostatFormProps): JSX.Element {
  const { t } = useTranslation()
  const scales = ['0.5', '1']

  const scalesMenu = scales.map((scale) => {
    return (<MenuItem key={scale} value={scale}>{scale}</MenuItem>)
  })

  return (
    <Stack spacing={2}>
      <FormControl>
        <FormLabel>{t('label.scale')}</FormLabel>
        <Select
          name="scale"
          defaultValue={scales.at(0)}
          onChange={(e) => {
            props.onScaleChanged?.(e.target.value)
          }}>
          {scalesMenu}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t('label.cool')}</FormLabel>
        <TempSlider
          name="cool_temp_range"
          color="blue"
          tempRange={[10, 35]}
          onChangeCommitted={(value) => {
            props.onCoolTempScalesChanged?.([value[0], value[1]])
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t('label.heat')}</FormLabel>
        <TempSlider
          name="heat_temp_range"
          color="red"
          tempRange={[0, 25]}
          onChangeCommitted={(value) => {
            props.onHeatTempScalesChanged?.([value[0], value[1]])
          }}
        />
      </FormControl>
    </Stack>

  )
}
