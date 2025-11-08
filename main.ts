//% color=#DD8020 icon="\uf11b" block="DFRobot GamePad V4"
namespace gamepadV4 {

    export enum GamePadButton {
        //% block="A"
        A = 0,
        //% block="B"
        B = 1,
        //% block="C"
        C = 2,
        //% block="D"
        D = 3,
        //% block="E"
        E = 4,
        //% block="F"
        F = 5,
        //% block="Z (joystick clic)"
        Z = 6
    }

    // broches (constantes littérales utilisées côté TS)
    const PIN_A = DigitalPin.P5
    const PIN_B = DigitalPin.P11
    const PIN_C = DigitalPin.P13
    const PIN_D = DigitalPin.P14
    const PIN_E = DigitalPin.P15
    const PIN_F = DigitalPin.P16
    const PIN_Z = DigitalPin.P8

    const PIN_X = AnalogPin.P1
    const PIN_Y = AnalogPin.P2
    const PIN_VIB = DigitalPin.P12

    // état cache local (mis à jour par le natif via events)
    let buttonStates: boolean[] = [false, false, false, false, false, false, false]

    // ------------------- SHIMS natifs -------------------
    // initialise la gestion native (C++) des boutons (installe interruptions / handlers natifs)
    //% shim=gamepad::nativeInit
    function nativeInit(): void {
        // shim: implementation en C++
    }

    // lit l'état logique d'un bouton depuis le natif (0/1)
    //% shim=gamepad::nativeIsDown
    function nativeIsDown(index: number): boolean {
        return false
    }

    // demande au natif de forcer la remontée d'un event (utile pour test)
    //% shim=gamepad::nativeForceEvent
    function nativeForceEvent(index: number, down: boolean): void {
    }

    // ------------------- TS API -------------------

    /**
     * Initialise le GamePad (installe les handlers natifs)
     */
    //% block="initialiser le GamePad"
    export function init(): void {
        // config pull-up côté TS pour être sûr (natf fera aussi sa config)
        pins.setPull(PIN_A, PinPullMode.PullUp)
        pins.setPull(PIN_B, PinPullMode.PullUp)
        pins.setPull(PIN_C, PinPullMode.PullUp)
        pins.setPull(PIN_D, PinPullMode.PullUp)
        pins.setPull(PIN_E, PinPullMode.PullUp)
        pins.setPull(PIN_F, PinPullMode.PullUp)
        pins.setPull(PIN_Z, PinPullMode.PullUp)

        // appelle le natif qui installera les interruptions "hardware-safe"
        nativeInit()

        // démarre un thread TS léger pour synchroniser l'état local (optionnel)
        control.inBackground(() => {
            while (true) {
                for (let i = 0; i <= 6; i++) {
                    const s = nativeIsDown(i)
                    // si changement d'état on lève les events TS (compat)
                    if (s != buttonStates[i]) {
                        buttonStates[i] = s
                        if (s) control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
                        else control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_UP)
                    }
                }
                basic.pause(50)
            }
        })
    }

    //% block="bouton %btn appuyé ?"
    export function isButtonDown(btn: GamePadButton): boolean {
        return buttonStates[<number>btn]
    }

    //% block="quand bouton %btn appuyé"
    export function onButtonPressed(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, handler)
    }

    //% block="quand bouton %btn relâché"
    export function onButtonReleased(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_UP, handler)
    }

    //% block="axe X"
    export function axeX(): number {
        let raw = pins.analogReadPin(PIN_X)
        let value = (raw - 512) * 100 / 512
        if (value > 100) value = 100
        if (value < -100) value = -100
        return Math.round(value)
    }

    //% block="axe Y"
    export function axeY(): number {
        let raw = pins.analogReadPin(PIN_Y)
        let value = (raw - 512) * 100 / 512
        if (value > 100) value = 100
        if (value < -100) value = -100
        return Math.round(value)
    }

    //% block="joystick pressé (Z)"
    export function axeZ(): boolean {
        return isButtonDown(GamePadButton.Z)
    }

    //% block="vibreur pendant %duration|ms"
    export function vibrate(duration: number): void {
        pins.digitalWritePin(PIN_VIB, 1)
        basic.pause(duration)
        pins.digitalWritePin(PIN_VIB, 0)
    }
}
