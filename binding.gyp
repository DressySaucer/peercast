{
    "targets": [
        {
            "target_name": "vinput",
            "include_dirs": [
                "/Users/jrpha/dev/peercast-test/node_modules/node-addon-api"
            ],
            "cflags": [
                "-std=c++20"
            ],
            "sources": [ "src/lib/vinput/keypress.cpp", "src/lib/vinput/keycode.cpp" ],
            "link_settings": {
                "libraries": [
                    "-framework Carbon",
                    "-framework CoreFoundation",
                    "-framework ApplicationServices"
                ]
            },
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
            "xcode_settings": {
                "CLANG_CXX_LANGUAGE_STANDARD": "c++20",
                "OTHER_CFLAGS": ["-std=c++20"],
                "OTHER_CPLUSPLUSFLAGS": ["-std=c++20"],
                "OTHER_CPLUSPLUSFLAGS!": ["-std=c++11"]
            }
        }
    ]
}
