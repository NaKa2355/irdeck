import { useTranslation } from "react-i18next";
import { TempSlider } from "../../monecules/tempSlider";
import { Stack, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useAddRemoteModal } from "../../../hooks/useAddRemoteModal";
import { useAddRemoteModalState } from "../../../hooks";

export function AddThermostatForm() {
  const { t } = useTranslation();
  const addRemoteModalState = useAddRemoteModalState();
  const modal = useAddRemoteModal();

  const scalesMenu = addRemoteModalState.scales.map((scale) => {
    return (<MenuItem key={scale} value={scale}>{scale}</MenuItem>)
  });

  return (
    <Stack spacing={2}>
      <FormControl>
        <FormLabel>{t("label.scale")}</FormLabel>
        <Select defaultValue={addRemoteModalState.scale} onChange={(e) => {
          modal.onScaleChanged(e.target.value)
        }}>
          {scalesMenu}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.cool")}</FormLabel>
        <TempSlider
          color="blue"
          tempRange={addRemoteModalState.coolTempRange}
          onChangeCommitted={(value) => {
            modal.onCoolTempRangeChanged([value[0], value[1]])
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.heat")}</FormLabel>
        <TempSlider
          color="red"
          tempRange={addRemoteModalState.heatTempRange}
          onChangeCommitted={(value) => {
            modal.onHeatTempRangeChanged([value[0], value[1]])
          }}
        />
      </FormControl>
    </Stack>

  )
}