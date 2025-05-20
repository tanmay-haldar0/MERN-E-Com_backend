import { create } from 'zustand';

export const useCanvasStore = create((set) => ({
  mode: '2D',
  toggleMode: () => set((state) => ({ mode: state.mode === '2D' ? '3D' : '2D' })),
}));
