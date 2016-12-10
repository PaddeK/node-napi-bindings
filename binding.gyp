{
    "targets": [
        {
            "target_name": "napi",
            "type": "shared_library",
            "sources": [
                "deps/NapiDll.cpp",
                "deps/dllmain.cpp"
            ],
            "include_dirs": [
                "deps"
            ],
            "libraries": [
                "../deps/napi-net.lib"
            ],
            "defines": [
                "NAPIDLL_EXPORTS"
            ],
            "configurations": {
                "Release": {
                    "msvs_settings": {
                        "VCCLCompilerTool": {
                            "ExceptionHandling": 1,
                            "RuntimeTypeInfo": "true",
                            "RuntimeLibrary": "2"
                        },
                        "VCLinkerTool": {
                            "AdditionalDependencies": [
                                "Ws2_32.lib"
                            ]
                        }
                    }
                }
            }
        },
        {
            "target_name": "copy_binary",
            "type": "none",
            "dependencies" : [
                "napi"
            ],
            "copies": [
                {
                    "destination": "<(module_root_dir)/bin",
                    "files": [
                        "<(module_root_dir)/build/Release/napi.dll"
                    ]
                }
            ]
        }
    ]
}