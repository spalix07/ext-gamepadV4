// gamepad.ts
//% color=#00AAFF weight=90 icon="\uf11b"
//% block="Gamepad"
namespace gamepad {
    //% block="initialiser le gamepad"
    export function init(): void {
        gamepad_native_init()
    }

    // --- Fonctions exposées ---
    //% block="bouton A appuyé"
    export function isPressedA(): boolean {
        return gamepad_native_isPressedA()
    }

    //% block="bouton B appuyé"
    export function isPressedB(): boolean {
        return gamepad_native_isPressedB()
    }

    //% block="bouton X appuyé"
    export function isPressedX(): boolean {
        return gamepad_native_isPressedX()
    }

    //% block="bouton Y appuyé"
    export function isPressedY(): boolean {
        return gamepad_native_isPressedY()
    }

    //% block="bouton Z appuyé"
    export function isPressedZ(): boolean {
        return gamepad_native_isPressedZ()
    }

    // --- Déclarations natives ---
    //% shim=gamepad::init
    declare function gamepad_native_init(): void;
    //% shim=gamepad::isPressedA
    declare function gamepad_native_isPressedA(): boolean;
    //% shim=gamepad::isPressedB
    declare function gamepad_native_isPressedB(): boolean;
    //% shim=gamepad::isPressedX
    declare function gamepad_native_isPressedX(): boolean;
    //% shim=gamepad::isPressedY
    declare function gamepad_native_isPressedY(): boolean;
    //% shim=gamepad::isPressedZ
    declare function gamepad_native_isPressedZ(): boolean;
}
