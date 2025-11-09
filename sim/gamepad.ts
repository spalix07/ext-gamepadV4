namespace pxsim.gamepad {
    let state = {
        buttons: { A: false, B: false, X: false, Y: false, Z: false },
        joysticks: { x: 0, y: 0 }
    };

    export function init() {
        // simulateur initialisé
        console.log("pxsim.gamepad.init()");
    }

    export function buttonPressed(btn: number): boolean {
        switch (btn) {
            case 0: return state.buttons.A;
            case 1: return state.buttons.B;
            case 2: return state.buttons.X;
            case 3: return state.buttons.Y;
            case 4: return state.buttons.Z;
        }
        return false;
    }

    export function joystickX(): number {
        return state.joysticks.x;
    }

    export function joystickY(): number {
        return state.joysticks.y;
    }

    // simulateur peut forcer l'état (debug)
    export function __setButton(btn: string, pressed: boolean) {
        state.buttons[btn] = pressed;
    }
}
