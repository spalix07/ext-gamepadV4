/**
 * 🎮 DFRobot GamePad V4.0 (extension native)
 */
//% weight=100 color=#999999 icon="🎮" block="DFRobot GamePad V4"
namespace gamepadV4 {

    export enum Button {
        A = 0,
        B,
        C,
        D,
        E,
        F,
        Z
    }

    export enum Axis {
        X,
        Y
    }

    /**
     * Initialise le GamePad (active les interruptions et les résistances)
     */
    //% blockId=gamepadv4_init block="initialiser le GamePad"
    //% shim=gamepad::init
    export function init(): void {
        return
    }

    /**
     * Déclenche une action quand un bouton est pressé
     */
    //% blockId=gamepadv4_onbuttonpressed block="quand bouton %btn|est pressé"
    export function onButtonPressed(btn: Button, handler: () => void): void {
        control.onEvent(5200 + btn, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, handler)
    }

    /**
     * Déclenche une action quand un bouton est relâché
     */
    //% blockId=gamepadv4_onbuttonreleased block="quand bouton %btn|est relâché"
    export function onButtonReleased(btn: Button, handler: () => void): void {
        control.onEvent(5200 + btn, EventBusValue.MICROBIT_BUTTON_EVT_UP, handler)
    }

    /**
     * Lecture d’un axe du joystick (-100 à +100)
     */
    //% blockId=gamepadv4_readjoystick block="valeur joystick %axis"
    //% shim=gamepad::readJoystick
    export function readJoystick(axis: Axis): number {
        return 0
    }

    /**
     * Active le vibreur pendant un certain temps
     */
    //% blockId=gamepadv4_vibrate block="vibrer pendant %ms|ms"
    //% shim=gamepad::vibrate
    export function vibrate(ms: number): void {
        return
    }
}
