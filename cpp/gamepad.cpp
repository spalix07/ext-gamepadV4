#include "pxt.h"
#include "gamepad.h"

using namespace pxt;

static bool btnState[7] = { false, false, false, false, false, false, false };

// mapping des indices vers les pins DAL MicroBitPin*
// Sur la plupart des builds PXT, on peut accéder à uBit.io.P5, uBit.io.P11, ...
// Si ta toolchain utilise un autre nom, adapte ici.
static MicroBitPin* btnPins[7] = {
    &uBit.io.P5,   // A -> P5
    &uBit.io.P11,  // B -> P11
    &uBit.io.P13,  // C -> P13
    &uBit.io.P14,  // D -> P14
    &uBit.io.P15,  // E -> P15
    &uBit.io.P16,  // F -> P16
    &uBit.io.P8    // Z -> P8
};

extern "C" {

// forward
void btnOnPulse(MicroBitPinEvent evt);

// initialisation native
void gamepad::nativeInit()
{
    // configure chaque pin en entrée avec pull up, et attach handler
    for (int i = 0; i < 7; ++i) {
        MicroBitPin* p = btnPins[i];
        if (!p) continue;
        p->setPull(PullUp);
        // attacher écoute sur both edges : FALLING -> pressed, RISING -> released
        // On utilise "digitalRead" pour initialiser l'état
        int v = p->getDigitalValue();
        btnState[i] = (v == 0) ? true : false; // si active-low wiring : adapte si besoin

        // on attache un event handler en C++ qui va lever un MicroBitEvent
        // l'API DAL: p->eventOn( MICROBIT_PIN_EVT_PULSE) n'existe pas uniformément,
        // on utilise event listener sur CHANGE via uBit.messageBus.listen avec id = MICROBIT_ID_IO_P0 etc.
        // mais MicroBitPin propose : p->isTouched(), p->getDigitalValue(), p->messageBusListen...
        // la méthode portable : utiliser pin->getDigitalValue() + micro:bit interrupt via pin->eventOn...
        p->eventOn(MICROBIT_PIN_EVT_FALL, (MicroBitEventHandler) btnOnPulse);
        p->eventOn(MICROBIT_PIN_EVT_RISE,  (MicroBitEventHandler) btnOnPulse);
        // Note: micro:bit DAL peut nommer ces enums DIFFEREMMENT selon version ; adapte si compile fail
    }
}

// handler C++ appelé lors d'un changement de front
void btnOnPulse(MicroBitEvent e)
{
    // e.sourceId contient l'ID du pin (ex. MICROBIT_ID_IO_P5)
    // e.value va indiquer event type; on doit retrouver l'index du pin
    int pinIndex = -1;
    int source = e.sourceId;

    // Map source ids to our index — adapte si nécessaire :
    if (source == MICROBIT_ID_IO_P5) pinIndex = 0;
    else if (source == MICROBIT_ID_IO_P11) pinIndex = 1;
    else if (source == MICROBIT_ID_IO_P13) pinIndex = 2;
    else if (source == MICROBIT_ID_IO_P14) pinIndex = 3;
    else if (source == MICROBIT_ID_IO_P15) pinIndex = 4;
    else if (source == MICROBIT_ID_IO_P16) pinIndex = 5;
    else if (source == MICROBIT_ID_IO_P8)  pinIndex = 6;

    if (pinIndex < 0) return;

    // lire l'état actuel (0 = low), nous supposons wiring active-low (bouton vers GND).
    int v = btnPins[pinIndex]->getDigitalValue();
    bool down = (v == 0);

    // si changement, mettre à jour et lever event
    if (down != btnState[pinIndex]) {
        btnState[pinIndex] = down;
        if (down) {
            // lever event micro:bit (id = index, value = MICROBIT_BUTTON_EVT_DOWN)
            uBit.messageBus.raiseEvent(pinIndex, MICROBIT_BUTTON_EVT_DOWN);
        } else {
            uBit.messageBus.raiseEvent(pinIndex, MICROBIT_BUTTON_EVT_UP);
        }
    }
}

// lecture TS -> natif
bool gamepad::nativeIsDown(int index)
{
    if (index < 0 || index > 6) return false;
    return btnState[index];
}

// forcer event (utile pour debug)
void gamepad::nativeForceEvent(int index, bool down)
{
    if (index < 0 || index > 6) return;
    btnState[index] = down;
    if (down) uBit.messageBus.raiseEvent(index, MICROBIT_BUTTON_EVT_DOWN);
    else uBit.messageBus.raiseEvent(index, MICROBIT_BUTTON_EVT_UP);
}

} // extern "C"
