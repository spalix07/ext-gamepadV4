#ifndef GAMEPAD_H
#define GAMEPAD_H

#include "pxt.h"

namespace gamepad {
    void nativeInit();
    bool nativeIsDown(int index);
    void nativeForceEvent(int index, bool down);
}

#endif // GAMEPAD_H
