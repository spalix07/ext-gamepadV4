#include "pxt.h"
using namespace pxt;

// namespace correspondant à "gamepad" dans les shims TypeScript
namespace gamepad {

    // tableau des broches utilisées pour les boutons
    static const PinName btnPins[] = {
        MICROBIT_ID_IO_P5,   // A
        MICROBIT_ID_IO_P11,  // B
        MICROBIT_ID_IO_P13,  // C
        MICROBIT_ID_IO_P14,  // D
        MICROBIT_ID_IO_P15,  // E
        MICROBIT_ID_IO_P16,  // F
        MICROBIT_ID_IO_P8    // Z
    };

    static MicroBitPin* pinsArr[ARRAYSIZE(btnPins)] = { nullptr };
    static bool btnState[ARRAYSIZE(btnPins)] = { false };

    /**
     * Lecture directe de l'état logique d'un bouton
     */
    //%
    bool nativeIsDown(int index) {
        if (index < 0 || index >= (int)ARRAYSIZE(pinsArr)) return false;
        auto p = pinsArr[index];
        if (!p) return false;
        return p->getDigitalValue() == 0; // actif bas
    }

    /**
     * Forçage d'un événement (utilisé par fallback TS)
     */
    //%
    void nativeForceEvent(int index, bool down) {
        if (index < 0 || index >= (int)ARRAYSIZE(pinsArr)) return;
        MicroBitEvent ev(index, down ? MICROBIT_BUTTON_EVT_DOWN : MICROBIT_BUTTON_EVT_UP);
    }

    /**
     * Initialisation native : configure les broches et interruptions
     */
    //%
    void nativeInit() {
        for (int i = 0; i < (int)ARRAYSIZE(btnPins); ++i) {
            PinName name = btnPins[i];
            auto p = LOOKUP_PIN(name);
            if (!p) continue;
            pinsArr[i] = p;
            p->setPull(PullUp);
            btnState[i] = (p->getDigitalValue() == 0);

            // attache une interruption sur changement d'état
            p->eventOn(DEVICE_PIN_EVENT_ON_EDGE);
            p->onEvent(MICROBIT_PIN_EVT_RISE, [i](MicroBitEvent) {
                if (btnState[i]) {
                    btnState[i] = false;
                    MicroBitEvent ev(i, MICROBIT_BUTTON_EVT_UP);
                }
            });
            p->onEvent(MICROBIT_PIN_EVT_FALL, [i](MicroBitEvent) {
                if (!btnState[i]) {
                    btnState[i] = true;
                    MicroBitEvent ev(i, MICROBIT_BUTTON_EVT_DOWN);
                }
            });
        }
    }
}
