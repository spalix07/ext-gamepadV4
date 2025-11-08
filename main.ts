//% color=#EE8010 icon="\uf11b" block="DFRobot GamePad V4"
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
    // Neutralise les boutons internes du micro:bit
    input.onButtonPressed(Button.A, function () {})
    input.onButtonPressed(Button.B, function () {})

    // Pull-up sur toutes les broches utilisées
    for (let i = 0; i < pinMap.length; i++) {
        pins.setPull(pinMap[i], PinPullMode.PullUp)
    }

    // Configurer les interruptions pour chaque bouton explicitement
    setupPinInterrupt(DigitalPin.P5, 0)
    setupPinInterrupt(DigitalPin.P11, 1)
    setupPinInterrupt(DigitalPin.P13, 2)
    setupPinInterrupt(DigitalPin.P14, 3)
    setupPinInterrupt(DigitalPin.P15, 4)
    setupPinInterrupt(DigitalPin.P16, 5)
}

// Fonction utilitaire pour simplifier les appels
function setupPinInterrupt(pin: DigitalPin, index: number) {
    pins.onPulsed(pin, pins.PulseValue.Low, () => {
        if (!buttonStates[index]) {
            buttonStates[index] = true
            control.raiseEvent(index, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        }
    })
    pins.onPulsed(pin, pins.PulseValue.High, () => {
        if (buttonStates[index]) {
            buttonStates[index] = false
            control.raiseEvent(index, EventBusValue.MICROBIT_BUTTON_EVT_UP)
        }
    })
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
