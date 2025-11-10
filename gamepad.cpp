#include "pxt.h"
using namespace pxt;
using namespace codal;

// On récupère la fonction getPin() utilisée par MakeCode pour retrouver la broche micro:bit
namespace pxt {
    MicroBitPin* getPin(int id);
}

// =========================================================
//  FONCTIONS DU MODULE GAMEPAD
// =========================================================
namespace gamepad {

    /**
     * Lit l’état logique (0/1) d’une broche numérique.
     */
    //%
    int GAMEPAD_digitalReadPin(int name) {
        MicroBitPin* pin = pxt::getPin(name);
        if (NULL == pin)
            return 0;
        return pin->getDigitalValue();
    }

    /**
     * Définit le mode de pull-up/pull-down sur une broche.
     */
    //%
    void GAMEPAD_setPull(int name, int pull) {
        MicroBitPin* pin = pxt::getPin(name);
        if (NULL == pin)
            return;
        PinMode mode = PullNone;
        switch (pull) {
            case 1: mode = PullDown; break;
            case 2: mode = PullUp; break;
            default: mode = PullNone; break;
        }
        pin->setPull(mode);
    }

    /**
     * Déclenche une interruption lorsque la broche reçoit une impulsion
     * (transition LOW→HIGH ou HIGH→LOW).
     */
    //%
    void GAMEPAD_onPulsed(int name, int pulse, Action body) {
        MicroBitPin* pin = pxt::getPin(name);
        if (NULL == pin)
            return;

        int event = 0;
        if (pulse == 0)
            event = MICROBIT_PIN_EVENT_ON_PULSE_HIGH;
        else
            event = MICROBIT_PIN_EVENT_ON_PULSE_LOW;

        // On attache l'action utilisateur à cet événement
        pin->eventOn(MICROBIT_PIN_EVENT_ON_PULSE);
        pin->onEvent(event, body);
    }

} // namespace gamepad
