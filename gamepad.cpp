#include "pxt.h"

#if MICROBIT_CODAL
#include "Pin.h"
#define PinCompat codal::Pin
#undef Button
#include "MicroBitButton.h"
#else
#define PinCompat MicroBitPin
#endif

namespace pxt {
    MicroBitPin *getPin(int id);
}

namespace gamepad {

#if MICROBIT_CODAL
    using codal::Button;
#else
    using ::MicroBitButton;
#endif

// --- Définition des boutons physiques du gamepad ---
#define BUTTON_A_PIN MICROBIT_ID_IO_P5
#define BUTTON_B_PIN MICROBIT_ID_IO_P11
#define BUTTON_X_PIN MICROBIT_ID_IO_P15
#define BUTTON_Y_PIN MICROBIT_ID_IO_P16
#define BUTTON_Z_PIN MICROBIT_ID_IO_P8  // Exemple : à adapter selon ton câblage

// Pointeurs vers les objets boutons
MicroBitButton *buttonA = nullptr;
MicroBitButton *buttonB = nullptr;
MicroBitButton *buttonX = nullptr;
MicroBitButton *buttonY = nullptr;
MicroBitButton *buttonZ = nullptr;

// --- Initialisation du Gamepad ---
void init() {
#if MICROBIT_CODAL
    buttonA = new MicroBitButton(*pxt::getPin(BUTTON_A_PIN), BUTTON_A_PIN, MICROBIT_BUTTON_ALL_EVENTS);
    buttonB = new MicroBitButton(*pxt::getPin(BUTTON_B_PIN), BUTTON_B_PIN, MICROBIT_BUTTON_ALL_EVENTS);
    buttonX = new MicroBitButton(*pxt::getPin(BUTTON_X_PIN), BUTTON_X_PIN, MICROBIT_BUTTON_ALL_EVENTS);
    buttonY = new MicroBitButton(*pxt::getPin(BUTTON_Y_PIN), BUTTON_Y_PIN, MICROBIT_BUTTON_ALL_EVENTS);
    buttonZ = new MicroBitButton(*pxt::getPin(BUTTON_Z_PIN), BUTTON_Z_PIN, MICROBIT_BUTTON_ALL_EVENTS);
#else
    buttonA = new MicroBitButton((PinName)pxt::getPin(BUTTON_A_PIN)->name, BUTTON_A_PIN, MICROBIT_BUTTON_ALL_EVENTS, PinMode::PullUp);
    buttonB = new MicroBitButton((PinName)pxt::getPin(BUTTON_B_PIN)->name, BUTTON_B_PIN, MICROBIT_BUTTON_ALL_EVENTS, PinMode::PullUp);
    buttonX = new MicroBitButton((PinName)pxt::getPin(BUTTON_X_PIN)->name, BUTTON_X_PIN, MICROBIT_BUTTON_ALL_EVENTS, PinMode::PullUp);
    buttonY = new MicroBitButton((PinName)pxt::getPin(BUTTON_Y_PIN)->name, BUTTON_Y_PIN, MICROBIT_BUTTON_ALL_EVENTS, PinMode::PullUp);
    buttonZ = new MicroBitButton((PinName)pxt::getPin(BUTTON_Z_PIN)->name, BUTTON_Z_PIN, MICROBIT_BUTTON_ALL_EVENTS, PinMode::PullUp);
#endif
}

// --- Fonctions de lecture d'état ---
bool isPressedA() { return buttonA && buttonA->isPressed(); }
bool isPressedB() { return buttonB && buttonB->isPressed(); }
bool isPressedX() { return buttonX && buttonX->isPressed(); }
bool isPressedY() { return buttonY && buttonY->isPressed(); }
bool isPressedZ() { return buttonZ && buttonZ->isPressed(); }

// --- Accès pour MakeCode (interface TS) ---
}

// namespace MakeCode exposé à TS
namespace pxtrt {
    using namespace gamepad;
}
