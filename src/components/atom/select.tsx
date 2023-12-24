// import { Select as BaseSelect } from '@mui/material'
// import React, { type ReactNode } from 'react'
// import { type Control, Controller } from 'react-hook-form'

// interface SelectProps {
//   name: string
//   control: Control
//   defaultValue: string
//   children?: ReactNode
// }

// export function Select (props: SelectProps): React.ReactElement {
//   return (
//     <Controller
//       name={props.name}
//       control={props.control}
//       render={({ field }) => (
//         <BaseSelect defaultValue={props.defaultValue} onChange={(value) => { field.onChange(value) }}>
//           {props.children}
//         </BaseSelect>
//       )}
//     />
//   )
// }
