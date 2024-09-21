import { create } from "zustand";

type AiExhaustedModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useAiExhaustedModal = create<AiExhaustedModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
