
import { Select as BaseSelect } from "@mui/material";
import { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";

interface SelectProps {
  name: string
  control: Control
  children?: ReactNode
}

export function Select(props: SelectProps) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({field}) => (
        <BaseSelect defaultValue={field.value} onChange={(value) => {field.onChange(value)}}>
          {props.children}
        </BaseSelect>
      )}
    />
  )
}