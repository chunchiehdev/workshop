// src/store/botStore.ts
import { create } from 'zustand';

interface BotState {
  // 本地UI狀態
  selectedBotId: number | null;
  isDrawerOpen: boolean;
  
  // 選擇器行為
  selectBot: (id: number | null) => void;
  toggleDrawer: (isOpen?: boolean) => void;
  
}

export const useBotStore = create<BotState>((set) => ({
  // 本地UI狀態
  selectedBotId: null,
  isDrawerOpen: false,
  
  // 選擇器行為
  selectBot: (id) => set({ selectedBotId: id }),
  toggleDrawer: (isOpen) => set((state) => ({ 
    isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen 
  })),
  
}));