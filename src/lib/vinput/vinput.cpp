#include <napi.h>
#include "keycode.h"
#include "mouse.h"
#include "keyboard.h"

#define SET_EXPORT(name, func) exports.Set(Napi::String::New(env, name), Napi::Function::New(env, func));

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    SET_EXPORT("keyDown", [](const Napi::CallbackInfo& info) {
            if (info.Length() != 1) return info.Env().Undefined(); // add specific error handling & enable c++ exceptions
            std::string keyStr = info[0].ToString(); 
            if (!keyCodeMap.contains(keyStr)) return info.Env().Undefined();
            const CGKeyCode keyCode = keyCodeMap[keyStr];
            postKeyDown(keyCode);
            return info.Env().Undefined();
    });
    SET_EXPORT("keyUp", [](const Napi::CallbackInfo& info) {
            if (info.Length() != 1) return info.Env().Undefined();
            std::string keyStr = info[0].ToString(); 
            if (!keyCodeMap.contains(keyStr)) return info.Env().Undefined();
            const CGKeyCode keyCode = keyCodeMap[keyStr];
            postKeyUp(keyCode);
            return info.Env().Undefined();
    });
    SET_EXPORT("keyPress", [](const Napi::CallbackInfo& info) {
            if (info.Length() != 1) return info.Env().Undefined();
            std::string keyStr = info[0].ToString(); 
            if (!keyCodeMap.contains(keyStr)) return info.Env().Undefined();
            const CGKeyCode keyCode = keyCodeMap[keyStr];
            postKeyPress(keyCode);
            return info.Env().Undefined();
    });
    SET_EXPORT("mouseMove", [](const Napi::CallbackInfo& info) {
        int x = info[0].ToNumber();
        int y = info[1].ToNumber();
        postMouseMoved(x, y);
        return info.Env().Undefined();
    });
    SET_EXPORT("mouseClick", [](const Napi::CallbackInfo& info) {
        int x = info[0].ToNumber();
        int y = info[1].ToNumber();
        postMouseClick(x, y);
        return info.Env().Undefined();
    });
    SET_EXPORT("mouseDown", [](const Napi::CallbackInfo& info) {
        int x = info[0].ToNumber();
        int y = info[1].ToNumber();
        postMouseDown(x, y);
        return info.Env().Undefined();
    });
    SET_EXPORT("mouseUp", [](const Napi::CallbackInfo& info) {
        int x = info[0].ToNumber();
        int y = info[1].ToNumber();
        postMouseUp(x, y);
        return info.Env().Undefined();
    });
    SET_EXPORT("scroll", [](const Napi::CallbackInfo& info) {
        int pixelsY = info[0].ToNumber();
        int pixelsX = info[1].ToNumber();
        postScroll(pixelsY, pixelsX);
        return info.Env().Undefined();
    });
    return exports;
}

NODE_API_MODULE(vinput, Init)
