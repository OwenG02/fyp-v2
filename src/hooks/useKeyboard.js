import { useCallback, useEffect, useState} from "react"

function actionByKey(key){
    const keys = {
        KeyW: 'moveForward',
        KeyS: 'moveBackward',
        KeyA: 'moveLeft',
        KeyD: 'moveRight',
        Space: 'jump'
    }
    return keys[key]
}

export const useKeyboard = () => {
    const [action, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
        //textures??
    })

    const handleKeyDown = useCallback((e) => {
		const action = actionByKey(e.code)
		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: true
				})
			})
		}
	}, [])

    const handleKeyUp = useCallback((e) => {
		const action = actionByKey(e.code)
		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: false
				})
			})
		}
	}, [])

    useEffect(() => {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            //have to remove event listeners
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
            }
        },[handleKeyDown, handleKeyUp])
    return action
}