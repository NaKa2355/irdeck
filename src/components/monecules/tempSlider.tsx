import { Box, Grid, Slider, Typography } from "@mui/material"
import { useState } from "react"

type TempSliderProps = {
  color?: string
  tempRange: [number, number]
  onChangeCommitted?: (value: number[]) => void
}

export function TempSlider(props: TempSliderProps) {
  const [tempRange, setTemp] = useState<number[]>(props.tempRange)

  return (
    <Box pl="10px" pr="10px">
      <Slider
        value={tempRange}
        min={props.tempRange[0]}
        max={props.tempRange[1]}
        disableSwap
        onChangeCommitted={(_, tempRange) => {
          if (typeof tempRange === "object") {
            props.onChangeCommitted?.(tempRange)
          }
        }}
        onChange={(_, tempRange) => {
          if (typeof tempRange === "object") {
            setTemp(tempRange);
          }
        }}
        valueLabelDisplay="auto"
      />
      <Grid container alignItems='center' justifyContent='center' direction="row">
        <Grid item>
          <Typography>{props.tempRange[0]}℃ - {props.tempRange[1]}℃</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}