#include <nan.h>
#include <hyppox.h>

// AddonData holds per-addon-instance state and is cleaned up via an
// environment cleanup hook so it is safe with context-aware (NAPI) loading.
class AddonData {
 public:
  explicit AddonData(v8::Isolate* isolate) : call_count(0) {
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

// ---------------------------------------------------------------------------
// Main entry point called from JavaScript: addon.GetMessage(instruction, arg)
// ---------------------------------------------------------------------------
void GetMessage(const v8::FunctionCallbackInfo<v8::Value>& info) {
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
// Context-aware module initialisation (supports multi-context / worker threads)
// ---------------------------------------------------------------------------
NODE_MODULE_INIT() {
  v8::Isolate* isolate = context->GetIsolate();

  AddonData* data = new AddonData(isolate);

  v8::Local<v8::External> external = v8::External::New(isolate, data);

  exports->Set(context,
               v8::String::NewFromUtf8(isolate, "GetMessage").ToLocalChecked(),
               v8::FunctionTemplate::New(isolate, GetMessage, external)
                   ->GetFunction(context).ToLocalChecked()).FromJust();
}
