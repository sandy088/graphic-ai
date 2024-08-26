import { create } from "zustand";

type BuyTokenModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useBuyTokenModal = create<BuyTokenModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
