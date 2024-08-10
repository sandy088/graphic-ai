import { create } from "zustand";

type SubscriptionModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useSubscriptionModal = create<SubscriptionModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
