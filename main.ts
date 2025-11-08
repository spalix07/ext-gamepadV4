//% color=#CC6000 icon="\uf11b" block="DFRobot GamePad V4"
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

    // Brochages
    const pinMap: DigitalPin[] = [
        DigitalPin.P5,  // A
        DigitalPin.P11, // B
        DigitalPin.P13, // C
        DigitalPin.P14, // D
        DigitalPin.P15, // E
        DigitalPin.P16, // F
        DigitalPin.P8   // Z
    ]

    const pinAnalogX = AnalogPin.P1
    const pinAnalogY = AnalogPin.P2
    const pinVib = DigitalPin.P12

    let buttonStates: boolean[] = [false,false,false,false,false,false,false]

    /**
     * Initialise le GamePad en utilisant pins.onPulsed()
     */
    //% block="initialiser le GamePad"
    export function init(): void {
        // Pull-ups pour tous les boutons
        for (let i = 0; i < pinMap.length; i++) {
            pins.setPull(pinMap[i], PinPullMode.PullUp)
        }

        // Configuration des interruptions pour chaque bouton
        for (let i = 0; i < pinMap.length; i++) {
            const pin = pinMap[i]
            pins.onPulsed(pin, PulseValue.Low, () => {
                if (!buttonStates[i]) {
                    buttonStates[i] = true
                    control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
                }
            })
            pins.onPulsed(pin, PulseValue.High, () => {
                if (buttonStates[i]) {
                    buttonStates[i] = false
                    control.raiseEvent(i, EventBusValue.MICROBIT_BUTTON_EVT_UP)
                }
            })
        }
    }

    // --- Axes ---
    //% block="axe X"
    export function axeX(): number {
        let raw = pins.analogReadPin(pinAnalogX)
        let value = (raw - 512) * 100 / 512
        if (value > 100) value = 100
        if (value < -100) value = -100
        return Math.round(value)
    }

    //% block="axe Y"
    export function axeY(): number {
        let raw = pins.analogReadPin(pinAnalogY)
        let value = (raw - 512) * 100 / 512
        if (value > 100) value = 100
        if (value < -100) value = -100
        return Math.round(value)
    }

    //% block="joystick pressé (Z)"
    export function axeZ(): boolean {
        return buttonStates[6]
    }

    // --- Boutons ---
    //% block="bouton %btn appuyé"
    export function isButtonDown(btn: GamePadButton): boolean {
        return buttonStates[<number>btn]
    }

    //% block="lorsque bouton %btn appuyé"
    export function onButtonPressed(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, handler)
    }

    //% block="lorsque bouton %btn relâché"
    export function onButtonReleased(btn: GamePadButton, handler: () => void): void {
        control.onEvent(<number>btn, EventBusValue.MICROBIT_BUTTON_EVT_UP, handler)
    }

    // --- Vibreur et buzzer ---
    //% block="vibreur pendant %duration|ms"
    export function vibrate(duration: number): void {
        pins.digitalWritePin(pinVib, 1)
        basic.pause(duration)
        pins.digitalWritePin(pinVib, 0)
    }

  
}
