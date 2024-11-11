import create from 'zustand';

export const useStore= create((set) => ({
    //default mode is walk
    gamemode: 'walk',
    setGamemode: (mode) => set({ gamemode: mode }),
    // toggle between walk and midi mode
    toggleGamemode: () => set((state) => ({ gamemode: state.gamemode === 'walk' ? 'midi' : 'walk' })),
}));
