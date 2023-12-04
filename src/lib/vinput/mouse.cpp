#include "mouse.h"
#include <CoreGraphics/CoreGraphics.h>

#define NAPI_UNDEFINED(func) Napi::Value

void postMouseMoved(int x, int y) {
    CGPoint coords = CGPointMake(x, y);
    CGEventRef mouseEvent = CGEventCreateMouseEvent(NULL, kCGEventMouseMoved, coords, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, mouseEvent);
    CFRelease(mouseEvent);
}

void postMouseClick(int x, int y) {
    CGPoint coords = CGPointMake(x, y);
    CGEventRef mouseDownEvent = CGEventCreateMouseEvent(NULL, kCGEventLeftMouseDown, coords, kCGMouseButtonLeft);
    CGEventRef mouseUpEvent = CGEventCreateMouseEvent(NULL, kCGEventLeftMouseUp, coords, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, mouseDownEvent);
    CGEventPost(kCGHIDEventTap, mouseUpEvent);
    CFRelease(mouseDownEvent);
    CFRelease(mouseUpEvent);
}

void postMouseDown(int x, int y) {
    CGPoint coords = CGPointMake(x, y);
    CGEventRef mouseEvent = CGEventCreateMouseEvent(NULL, kCGEventLeftMouseDown, coords, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, mouseEvent);
    CFRelease(mouseEvent);
}

void postMouseUp(int x, int y) {
    CGPoint coords = CGPointMake(x, y);
    CGEventRef mouseEvent = CGEventCreateMouseEvent(NULL, kCGEventLeftMouseUp, coords, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, mouseEvent);
    CFRelease(mouseEvent);
}
