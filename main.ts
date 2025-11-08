
//% color=#FF8000 icon="\uf11b" block="DFRobot GamePad V4"
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
        //% block="Z"
        Z = 6
    }

    const PIN_X = AnalogPin.P1
    const PIN_Y = AnalogPin.P2
    const PIN_Z = DigitalPin.P8
    const PIN_VIB = DigitalPin.P12
    const PIN_BTN_A = DigitalPin.P5
    const PIN_BTN_B = DigitalPin.P11
    const PIN_BTN_C = DigitalPin.P13
    const PIN_BTN_D = DigitalPin.P14
    const PIN_BTN_E = DigitalPin.P15
    const PIN_BTN_F = DigitalPin.P16

    let lastStates: boolean[] = [false, false, false, false, false, false, false]

    // Initialisation
    //% block="initialiser le GamePad"
    export function init(): void {
        pins.setPull(PIN_Z, PinPullMode.PullUp)
        //pins.setPull(PIN_BTN_A, PinPullMode.PullUp)
        //pins.setPull(PIN_BTN_B, PinPullMode.PullUp)
        pins.setPull(PIN_BTN_C, PinPullMode.PullUp)
        pins.setPull(PIN_BTN_D, PinPullMode.PullUp)
        pins.setPull(PIN_BTN_E, PinPullMode.PullUp)
        pins.setPull(PIN_BTN_F, PinPullMode.PullUp)

        control.inBackground(() => {
            while (true) {
                checkButtons()
                basic.pause(20)
            }
        })
    }

    function readButton(btn: GamePadButton): boolean {
        switch (btn) {
//            case GamePadButton.A: return input.buttonIsPressed(Button.A)
//            case GamePadButton.B: return input.buttonIsPressed(Button.B)
//            case GamePadButton.A: return pins.digitalReadPin(PIN_BTN_A) == 0
//            case GamePadButton.B: return pins.digitalReadPin(PIN_BTN_B) == 0
            case GamePadButton.C: return pins.digitalReadPin(PIN_BTN_C) == 0
            case GamePadButton.D: return pins.digitalReadPin(PIN_BTN_D) == 0
            case GamePadButton.E: return pins.digitalReadPin(PIN_BTN_E) == 0
            case GamePadButton.F: return pins.digitalReadPin(PIN_BTN_F) == 0
            case GamePadButton.Z: return pins.digitalReadPin(PIN_Z) == 0
        }
        return false
    }

    function checkButtons() {
        for (let i = 0; i <= 6; i++) {
            const current = readButton(i)
            if (current && !lastStates[i]) {
                control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
            } else if (!current && lastStates[i]) {
                control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_UP)
            }
            lastStates[i] = current
        }
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

    //% block="axe Z (clic)"
    export function axeZ(): boolean {
        return pins.digitalReadPin(PIN_Z) == 0
    }

    //% block="bouton %btn appuyé ?"
    export function isButtonDown(btn: GamePadButton): boolean {
        return readButton(btn)
    }

    //% block="lorsque bouton %btn appuyé"
    export function onButtonPressed(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, handler)
    }

    //% block="lorsque bouton %btn relâché"
    export function onButtonReleased(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_UP, handler)
    }

    //% block="vibreur pendant %duration ms"
    export function vibrate(duration: number): void {
        pins.digitalWritePin(PIN_VIB, 1)
        basic.pause(duration)
        pins.digitalWritePin(PIN_VIB, 0)
    }

}

