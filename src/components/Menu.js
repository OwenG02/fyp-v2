import { useStore } from "../hooks/useStore"
import React, { useEffect } from "react";

export const Menu = () => {
	const [gamemode, toggleGamemode] = useStore((state) => [state.gamemode, state.toggleGamemode,]);


	useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'm' || event.key === 'M') {
                toggleGamemode();
            }
        };

		window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [toggleGamemode]);

	return (
        <div className="absolute menu">
		     <p>{gamemode === 'midi' ? 'Press M to Exit, Z/X Octave Up/Down' : 'Press M to Play, Z/X Octave Up/Down'}</p>
	    </div>
    );
}