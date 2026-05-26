#include <nan.h>
#include <hyppox.h>

// ---------------------------------------------------------------------------
// Main entry point called from JavaScript: addon.GetMessage(instruction, arg)
// ---------------------------------------------------------------------------
NAN_METHOD(GetMessage) {
  v8::Isolate* isolate = info.GetIsolate();

  if (info.Length() < 1) {
    Nan::ThrowTypeError("Arity mismatch: expected at least 1 argument");
    return;
  }

  // First argument is always an instruction string.
  v8::String::Utf8Value vs(isolate, info[0]);
  if (*vs == nullptr) {
    Nan::ThrowTypeError("First argument must be a string");
    return;
  }
  std::string str(*vs);

  std::string s = "Invalid arguments";
  hyppox_interface::Hyppox_Interface hi;

  /* Instruction codes:
      SQRT    – compute square root
      RCSVH   – read CSV file header names
      CCSVADD – (reserved) copy CSV file adding index column
      CRTMAPR – create mapper object
  */
  if (str == "SQRT") {
    if (!info[1]->IsNumber()) {
      Nan::ThrowTypeError("SQRT: second argument must be a number");
      return;
    }
    int32_t arg = info[1]->Int32Value(Nan::GetCurrentContext()).FromJust();
    s = hi.getSrt(arg);

  } else if (str == "RCSVH") {
    if (!info[1]->IsString()) {
      Nan::ThrowTypeError("RCSVH: second argument must be a string (file path)");
      return;
    }
    v8::String::Utf8Value tfnwp(isolate, info[1]);
    if (*tfnwp == nullptr) {
      Nan::ThrowTypeError("RCSVH: could not read file path string");
      return;
    }
    s = hi.getFileHeader(std::string(*tfnwp));

  } else if (str == "CCSVADD") {
    // Reserved – not yet implemented.
    s = "{}";

  } else if (str == "CRTMAPR") {
    if (!info[1]->IsArray()) {
      Nan::ThrowTypeError("CRTMAPR: second argument must be an array of parameters");
      return;
    }

    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(info[1]);
    std::vector<std::string> param;
    param.reserve(jsArr->Length());

    for (uint32_t i = 0; i < jsArr->Length(); i++) {
      v8::Local<v8::Value> jsElement = Nan::Get(jsArr, i).ToLocalChecked();
      v8::String::Utf8Value tps(isolate, jsElement);
      if (*tps != nullptr) {
        param.emplace_back(*tps);
      }
    }

    s = hi.callHyppoX(param);
  }

  v8::MaybeLocal<v8::String> retval = v8::String::NewFromUtf8(
      isolate, s.c_str(), v8::NewStringType::kNormal,
      static_cast<int>(s.length()));

  info.GetReturnValue().Set(retval.ToLocalChecked());
}

// ---------------------------------------------------------------------------
// Module initialisation — NAN_MODULE_WORKER_ENABLED makes the addon safe for
// use in Worker threads and abstracts V8 API version differences across
// Electron/Node.js releases.
// ---------------------------------------------------------------------------
NAN_MODULE_INIT(InitAll) {
  Nan::Export(target, "GetMessage", GetMessage);
}

NAN_MODULE_WORKER_ENABLED(NODE_GYP_MODULE_NAME, InitAll)
