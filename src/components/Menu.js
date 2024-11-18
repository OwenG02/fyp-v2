import { useStore } from "../hooks/useStore"

export const Menu = () => {
	const [gamemode, toggleGamemode] = useStore((state) => [state.gamemode, state.toggleGamemode,]);

	return (
        <div className="menu absolute">
		    <button
			    onClick={() => toggleGamemode()}
		    >Switch to {gamemode=== 'midi' ? 'walk' : 'midi'}
            </button>
	    </div>
    );
}