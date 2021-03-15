{
  "targets": [
    {
      "target_name": "hyppoxd",
      "include_dirs": [
        "node_modules/nan",#"<!(node -e \"require('nan')\")",
        "src",
        "src/src"
      ],
      "sources": [
        #"src/interface.cpp"
        "src/interfaceNaN.cpp"
      ],
      "libraries": [
        #"-lboost_filesystem", "-lboost_system"
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
