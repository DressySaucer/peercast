#include "keycode.h"

void postKey(CGKeyCode keyCode, bool keyDown) {
	CGEventRef keyEvent = CGEventCreateKeyboardEvent(NULL, keyCode, keyDown);

	CGEventPost(kCGHIDEventTap, keyEvent);

    CFRelease(keyEvent);
}

void postKeyDown(CGKeyCode keyCode) { postKey(keyCode, true); }

void postKeyUp(CGKeyCode keyCode) { postKey(keyCode, false); }

void postKeyPress(CGKeyCode keyCode) {
    postKeyDown(keyCode);
    postKeyUp(keyCode);
}
