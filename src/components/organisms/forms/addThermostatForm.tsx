import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TempSlider } from "../../monecules/tempSlider";
import { Stack, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { RemoteType } from "../../../type/remote";
import { AddButtonRequest } from "../../../hooks/useRemotes";

const heatingTempRange: [number, number] = [0, 25];
const coolingTempRange: [number, number] = [10, 35];
const scales = ['0.5', '1'];

interface AddThermostatFormProps {
  name: string
}

function getButtons(heatTempRange: [number, number], coolTempRange: [number, number], scale: string): Array<AddButtonRequest> {
  const buttons = new Array<AddButtonRequest>
  for (let i = heatTempRange[0]; i <= heatTempRange[1]; i += Number(scale)) {
    buttons.push({
      name: "h" + i.toFixed(1),
      tag: RemoteType.Thermostat
    })
  }

  for (let i = coolTempRange[0]; i <= coolTempRange[1]; i += Number(scale)) {
    buttons.push({
      name: "c" + i.toFixed(1),
      tag: RemoteType.Thermostat
    })
  }

  buttons.push({
    name: "off",
    tag: RemoteType.Thermostat
  })
  return buttons
}

export function AddThermostatForm(props: AddThermostatFormProps) {
  const { t } = useTranslation();
  const [scale, setScale] = useState(scales[0]);
  const [heatTempRange, setHeatTempRange] = useState<[number, number]>(heatingTempRange);
  const [coolTempRange, setCoolTempRange] = useState<[number, number]>(coolingTempRange);
  const form = useFormContext();

  form.setValue(props.name, getButtons(heatTempRange, coolTempRange, scale))

  const scalesMenu = scales.map((scale) => {
    return (<MenuItem value={scale}>{scale}</MenuItem>)
  })

  return (
    <Stack spacing={2}>
      <FormControl>
        <FormLabel>{t("label.scale")}</FormLabel>
        <Select defaultValue={scales[0]} onChange={(e) => {
          setScale(e.target.value)
        }}>
          {scalesMenu}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.cool")}</FormLabel>
        <TempSlider
          color="blue"
          tempRange={coolingTempRange}
          onChangeCommitted={(value) => {
            setCoolTempRange([value[0], value[1]])
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.heat")}</FormLabel>
        <TempSlider
          color="red"
          tempRange={heatingTempRange}
          onChangeCommitted={(value) => {
            setHeatTempRange([value[0], value[1]])
          }}
        />
      </FormControl>
    </Stack>

  )
}