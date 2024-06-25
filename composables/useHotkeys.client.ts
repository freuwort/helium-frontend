export function useHotkeys(keys: string, callback: Function, options: any = {}): void
{
    let pressed = keys.replace(' ', '+').split('+').map((key) => key.toLowerCase()).reduce((obj: any, key: string) => (obj[key] = false, obj), {})

    onMounted(() => { addEventListener('keydown', keyDown); addEventListener('keyup', keyUp) })
    onUnmounted(() => { removeEventListener('keydown', keyDown); removeEventListener('keyup', keyUp) })



    function keyDown(event: KeyboardEvent) {
        let key = event.key.toLowerCase()
        
        switch(key)
        {
            case 'escape':      handleKey('esc', true); break
            case 'control':     handleKey('ctrl', true); break
            case 'shift':       handleKey('shift', true); break
            case 'alt':         handleKey('alt', true); break
            case 'altgraph':    handleKey('alt', true); break
            case 'meta':        handleKey('meta', true); break
            case 'backspace':   handleKey('back', true); break
            case 'delete':      handleKey('del', true); break
            case 'enter':       handleKey('enter', true); break
            case ' ':           handleKey('space', true); break
            case 'tab':         handleKey('tab', true); break
            case 'command':     handleKey('cmd', true); break
            case 'capslock':    handleKey('caps', true); break
            case 'numlock':     handleKey('num', true); break
            case 'option':      handleKey('option', true); break
            default:            handleKey(key, true); break
        }

        check(event)
    }

    

    function keyUp(event: KeyboardEvent) {
        let key = event.key.toLowerCase()
        
        switch(key)
        {
            case 'escape':      handleKey('esc', false); break
            case 'control':     handleKey('ctrl', false); break
            case 'shift':       handleKey('shift', false); break
            case 'alt':         handleKey('alt', false); break
            case 'altgraph':    handleKey('alt', false); break
            case 'meta':        handleKey('meta', false); break
            case 'backspace':   handleKey('back', false); break
            case 'delete':      handleKey('del', false); break
            case 'enter':       handleKey('enter', false); break
            case ' ':           handleKey('space', false); break
            case 'tab':         handleKey('tab', false); break
            case 'command':     handleKey('cmd', false); break
            case 'capslock':    handleKey('caps', false); break
            case 'numlock':     handleKey('num', false); break
            case 'option':      handleKey('option', false); break
            default:            handleKey(key, false); break
        }

        check(event)
    }



    function handleKey(key: string, state: boolean) {
        if (pressed.hasOwnProperty(key)) pressed[key] = state;
    }



    function check(event: KeyboardEvent): void
    {
        if (!Object.values(pressed).every((value) => value === true)) return

        if (options.prevent) event.preventDefault()
        if (options.stop) event.stopPropagation()

        callback(event)
    }
}