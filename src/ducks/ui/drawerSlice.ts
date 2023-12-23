import { createSlice } from '@reduxjs/toolkit'

interface DrawerState {
  isOpen: boolean
}

const initialState: DrawerState = {
  isOpen: false
}

const drawerSlice = createSlice({
  name: 'ui.addRemoteEditModal',
  initialState,
  reducers: {
    drawerOpened: (state) => {
      state.isOpen = true
    },

    drawerClosed: (state) => {
      state.isOpen = false
    }
  }
})

export const drawerReducer = drawerSlice.reducer

export const {
  drawerClosed,
  drawerOpened
} = drawerSlice.actions
