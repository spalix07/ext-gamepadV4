#include "pxt.h"
using namespace pxt;

namespace gamepad {

MicroBitPin* buttonPins[] = {
    pxt::lookupPin(5),   // A
    pxt::lookupPin(11),  // B
    pxt::lookupPin(8),   // C
    pxt::lookupPin(13),  // D
    pxt::lookupPin(14),  // E
    pxt::lookupPin(15),  // F
    pxt::lookupPin(16)   // Z
};

MicroBitPin* vibPin = pxt::lookupPin(12);
MicroBitPin* joyX   = pxt::lookupPin(1);
MicroBitPin* joyY   = pxt::lookupPin(2);

const int baseEvent = 5200;

// --- Initialisation ---
void init() {
    for (int i = 0; i < 7; i++) {
        if (buttonPins[i]) {
            buttonPins[i]->setPull(PullUp);
            buttonPins[i]->eventOn(MICROBIT_PIN_EVENT_ON_PULSE);
            buttonPins[i]->onPulsed(HIGH, create_fiber([](int i){
                MicroBitEvent(baseEvent + i, MICROBIT_BUTTON_EVT_UP);
            }, i));
            buttonPins[i]->onPulsed(LOW, create_fiber([](int i){
                MicroBitEvent(baseEvent + i, MICROBIT_BUTTON_EVT_DOWN);
            }, i));
        }
    }
}

// --- Lecture du joystick ---
int readJoystick(int axis) {
    MicroBitPin* pin = (axis == 0) ? joyX : joyY;
    int raw = pin->getAnalogValue();
    int mapped = (raw - 512) * 100 / 512;
    if (mapped > 100) mapped = 100;
    if (mapped < -100) mapped = -100;
    return mapped;
}

// --- Contrôle du vibreur ---
void vibrate(int ms) {
    if (!vibPin) return;
    vibPin->setDigitalValue(1);
    fiber_sleep(ms);
    vibPin->setDigitalValue(0);
}

} // namespace gamepad
