import { create } from 'zustand'

import { colmeia } from '@/@types/colmeia'

interface colmeiaState {
  colmeias: colmeia[]
  setColmeias: (colmeias: colmeia[]) => void
}

const useColmeiaStore = create<colmeiaState>()((set) => ({
  colmeias: [],
  setColmeias: (colmeias: colmeia[]) => set({ colmeias }),
}))

export default useColmeiaStore
