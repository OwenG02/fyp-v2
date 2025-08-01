import create from 'zustand';
import * as Tone from 'tone';

export const useStore= create((set) => ({
    //default mode
    gamemode: 'walk',
    
    setGamemode: (mode) => set({ gamemode: mode }),
    // toggle between walk and midi mode
    toggleGamemode: async () => {
        await Tone.start();
        console.log('toggle gamemode');
        set((state) => ({ gamemode: state.gamemode === 'walk' ? 'midi' : 'walk' }));
    },

}));
