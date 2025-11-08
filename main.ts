/**
 * DFRobot GamePad V4.0 pour micro:bit
 * Compatible V1/V2 – avec fallback TS si le natif est absent.
 */
//% weight=100 color=#CC8030 icon="🎮" block="DFRobot GamePad V4"
namespace gamepadV4 {
    export enum GamePadButton {
        A = 0,
        B,
        C,
        D,
        E,
        F,
        Z
    }

    // États internes
    let buttonStates: boolean[] = [false, false, false, false, false, false, false]
    let _fallbackPolling = false
    let _pollingInterval = 50
    let _pollingHandle: number = undefined

    // Joystick calibration
    let xCenter = 512
    let yCenter = 512

    //% shim=gamepad::nativeInit
    function nativeInit(): void { }

    //% shim=gamepad::nativeIsDown
    function nativeIsDown(index: number): boolean { return false }

    //% shim=gamepad::nativeForceEvent
    function nativeForceEvent(index: number, down: boolean): void { }

    /**
     * Initialise le gamepad (C++, ou fallback TS si simulateur)
     */
    //% block="initialiser le GamePad V4"
    export function init(): void {
        try {
            nativeInit()
        } catch (e) {
            startFallbackPolling()
        }
    }

    /**
     * Active le vibreur sur P12
     */
    //% block="activer vibreur %on"
    export function vibration(on: boolean): void {
        pins.digitalWritePin(DigitalPin.P12, on ? 1 : 0)
    }

    /**
     * Renvoie vrai si le bouton est appuyé
     */
    //% block="bouton %btn|appuyé ?"
    export function isButtonDown(btn: GamePadButton): boolean {
        try {
            const v = nativeIsDown(<number>btn)
            buttonStates[<number>btn] = v
            return v
        } catch (e) {
            return buttonStates[<number>btn]
        }
    }

    /**
     * Événement bouton pressé
     */
    //% block="quand bouton %btn|pressé"
    export function onButtonPressed(btn: GamePadButton, handler: () => void) {
        control.onEvent(btn, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, handler)
    }

    /**
     * Événement bouton relâché
     */
    //% block="quand bouton %btn|relâché"
    export function onButtonReleased(btn: GamePadButton, handler: () => void) {
        control.onEvent(btn, EventBusValue.MICROBIT_BUTTON_EVT_UP, handler)
    }

    /**
     * Lecture de l'axe X du joystick (-100 à +100)
     */
    //% block="axe X"
    export function readX(): number {
        let val = pins.analogReadPin(AnalogPin.P1)
        let n = Math.map(val, 0, 1023, -100, 100)
        if (Math.abs(n) < 5) n = 0
        return Math.constrain(n, -100, 100)
    }

    /**
     * Lecture de l'axe Y du joystick (-100 à +100)
     */
    //% block="axe Y"
    export function readY(): number {
        let val = pins.analogReadPin(AnalogPin.P2)
        let n = Math.map(val, 0, 1023, -100, 100)
        if (Math.abs(n) < 5) n = 0
        return Math.constrain(n, -100, 100)
    }

    // ---------- Fallback TS (simulateur / sans natif) ----------

    function startFallbackPolling() {
        if (_fallbackPolling) return
        _fallbackPolling = true

        // Pull-ups sur toutes les broches
        pins.setPull(DigitalPin.P5, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P8, PinPullMode.PullUp)

        // Polling parallèle
        control.runInParallel(function () {
            while (true) {
                checkPin(DigitalPin.P5, GamePadButton.A)
                checkPin(DigitalPin.P11, GamePadButton.B)
                checkPin(DigitalPin.P13, GamePadButton.C)
                checkPin(DigitalPin.P14, GamePadButton.D)
                checkPin(DigitalPin.P15, GamePadButton.E)
                checkPin(DigitalPin.P16, GamePadButton.F)
                checkPin(DigitalPin.P8, GamePadButton.Z)
                basic.pause(_pollingInterval)
            }
        })
    }

    function checkPin(pin: DigitalPin, btn: GamePadButton) {
        const raw = pins.digitalReadPin(pin)
        const down = (raw == 0)
        const idx = <number>btn
        if (down != buttonStates[idx]) {
            buttonStates[idx] = down
            try {
                nativeForceEvent(idx, down)
            } catch (e) {
                control.raiseEvent(idx, down ?
                    EventBusValue.MICROBIT_BUTTON_EVT_DOWN :
                    EventBusValue.MICROBIT_BUTTON_EVT_UP)
            }
        }
    }
}
