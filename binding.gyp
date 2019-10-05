{
  "targets": [
    {
      "target_name": "interface",
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "src"
      ],
      "sources": [
        "interface.cpp"
      ],
      "libraries": [
            "-lboost_filesystem", "-lboost_system"
      ],
      "cflags_c": [
        "-std=c++14",
      ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
          }
        }]
      ]
    }
  ]
}
