#include <napi.h>
#include <ApplicationServices/ApplicationServices.h>
#include "keycode.h"

void createKeyEvent(CGKeyCode keyCode) {
	CGEventRef keyDown = CGEventCreateKeyboardEvent(NULL, keyCode, true);
	CGEventRef keyUp = CGEventCreateKeyboardEvent(NULL, keyCode, false);

	CGEventPost(kCGHIDEventTap, keyDown);
    	CGEventPost(kCGHIDEventTap, keyUp);

    	CFRelease(keyDown);
    	CFRelease(keyUp);
}

Napi::Value keypress(const Napi::CallbackInfo& info) {
    if (info.Length() != 1) return info.Env().Undefined(); // add specific error handling
    std::string keyStr = info[0].ToString(); 
    if (!keyCodeMap.contains(keyStr)) return info.Env().Undefined();
    const CGKeyCode keyCode = keyCodeMap[keyStr];
    createKeyEvent(keyCode);
    return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(Napi::String::New(env, "keypress"), Napi::Function::New(env, keypress));
	return exports;
}

NODE_API_MODULE(keypress, Init)
