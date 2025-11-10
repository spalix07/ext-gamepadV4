//% color=#EE8010 icon="\uf11b" block="GamePad"
namespace gamepad {
    //% block="lire la broche %pin"
    export function digitalReadPin(pin: DigitalPin): number {
        return GAMEPAD_digitalReadPin(pin)
    }

    //% block="définir la résistance de tirage de %pin sur %pull"
    export function setPull(pin: DigitalPin, pull: PinPullMode): void {
        GAMEPAD_setPull(pin, pull)
    }

    //% block="lorsque %pin reçoit une impulsion %pulse"
    export function onPulsed(pin: DigitalPin, pulse: PulseValue, handler: () => void): void {
        GAMEPAD_onPulsed(pin, pulse, handler)
    }
}

// Déclarations shim (liens vers le C++)
//% shim=gamepad::GAMEPAD_digitalReadPin
declare function GAMEPAD_digitalReadPin(pin: DigitalPin): number
//% shim=gamepad::GAMEPAD_setPull
declare function GAMEPAD_setPull(pin: DigitalPin, pull: PinPullMode): void
//% shim=gamepad::GAMEPAD_onPulsed
declare function GAMEPAD_onPulsed(pin: DigitalPin, pulse: PulseValue, handler: () => void): void
