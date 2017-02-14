{
    'conditions': [
        ['OS=="mac"', {
            'target_defaults': {
                'type': 'shared_library',
                'include_dirs': ['deps'],
                'sources': ['deps/NapiDynlib.cpp'],
                'xcode_settings': {
                    'CLANG_CXX_LANGUAGE_STANDARD': 'c++11',
                    'CLANG_CXX_LIBRARY': 'libc++',
                    'MACOSX_DEPLOYMENT_TARGET': '10.10',
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                    'GCC_ENABLE_CPP_RTTI': 'YES',
                    'DYLIB_COMPATIBILITY_VERSION': '4.0',
                    'DYLIB_CURRENT_VERSION': '4.0',
                    'EXECUTABLE_PREFIX': ''
                },
                'libraries': [
                    '$(SDKROOT)/System/Library/Frameworks/Foundation.framework',
                    '$(SDKROOT)/System/Library/Frameworks/CoreBluetooth.framework'
                ]
            },
            'targets': [
                {
                    'target_name': 'mac_napi-net',
                    'xcode_settings': {
                        'MACOSX_DEPLOYMENT_TARGET': '10.10',
                    },
                    'libraries': ['../deps/libnapi-net.a'],
                },
                {
                    'target_name': 'mac_napi',
                    'xcode_settings': {
                        'MACOSX_DEPLOYMENT_TARGET': '10.10',
                    },
                    'libraries': ['../deps/libnapi.a']
                },
                {
                    "target_name": "mac_copy_binary",
                    "type": "none",
                    "dependencies" : [
                        "mac_napi",
                        "mac_napi-net"
                    ],
                    'actions': [
                        {
                            'action_name': 'rename',
                            'inputs': [
                                "<(module_root_dir)/build/Release/mac_napi.dylib",
                                "<(module_root_dir)/build/Release/mac_napi-net.dylib"
                            ],
                            'outputs': [
                                "<(module_root_dir)/build/Release/napi.dylib",
                                "<(module_root_dir)/build/Release/napi-net.dylib"
                            ],
                            'action': [
                                'python',
                                './rename.py',
                                '<(module_root_dir)/build/Release/'
                            ]
                        }
                    ],
                    "copies": [
                        {
                            "destination": "<(module_root_dir)/bin",
                            "files": [
                                "<(module_root_dir)/build/Release/napi.dylib",
                                "<(module_root_dir)/build/Release/napi-net.dylib"
                            ]
                        }
                    ]
                }
            ]
        }],
        ['OS=="win"', {
            "targets": [
                {
                    "target_name": "win_napi",
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
                    "target_name": "win_copy_binary",
                    "type": "none",
                    "dependencies" : [
                        "win_napi"
                    ],
                    'actions': [
                        {
                            'action_name': 'rename',
                            'inputs': [
                                "<(module_root_dir)/build/Release/win_napi.dll"
                            ],
                            'outputs': [
                                "<(module_root_dir)/build/Release/napi.dll"
                            ],
                            'action': [
                                'python',
                                './rename.py',
                                '<(module_root_dir)/build/Release/'
                            ]
                        }
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
        }]
    ]
}