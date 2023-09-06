import { useTranslation } from "react-i18next";
import { TempSlider } from "../../monecules/tempSlider";
import { Stack, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useRecoilValue } from "recoil";
import { AddRemoteModalAtom } from "../../../recoil/atoms/addRemoteModal";
import { useAddRemoteModal } from "../../../hooks/useAddRemoteModal";

interface AddThermostatFormProps {
  name: string
}

export function AddThermostatForm(props: AddThermostatFormProps) {
  const { t } = useTranslation();
  const modalState = useRecoilValue(AddRemoteModalAtom);
  const modal = useAddRemoteModal();
  
  if(modalState.isOpen === undefined) {
    return (<></>);
  }

  const scalesMenu = modalState.scales.map((scale) => {
    return (<MenuItem key={scale} value={scale}>{scale}</MenuItem>)
  });

  return (
    <Stack spacing={2}>
      <FormControl>
        <FormLabel>{t("label.scale")}</FormLabel>
        <Select defaultValue={modalState.scales[0]} onChange={(e) => {
          modal.onScaleChanged(e.target.value)
        }}>
          {scalesMenu}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.cool")}</FormLabel>
        <TempSlider
          color="blue"
          tempRange={modalState.coolTempRange}
          onChangeCommitted={(value) => {
            modal.onCoolTempRangeChanged([value[0], value[1]])
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("label.heat")}</FormLabel>
        <TempSlider
          color="red"
          tempRange={modalState.heatTempRange}
          onChangeCommitted={(value) => {
            modal.onHeatTempRangeChanged([value[0], value[1]])
          }}
        />
      </FormControl>
    </Stack>

  )
}