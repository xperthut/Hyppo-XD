#include <nan.h>
#include "src/hyppox.h"

template<typename C>
inline v8::Local<C>
toLocalHandle(v8::MaybeLocal<C> handle)
{
  std::string s = "Something wrong";
    if (handle.IsEmpty())
        return ;
    return handle.ToLocalChecked();
}

void GetMessage(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Isolate* isolate = info.GetIsolate();

  // Validate the number of arguments.
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Arity mismatch");
    return;
  }

  // Validate the type of the first argument.
  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument must be a number");
    return;
  }

  // Get the number value of the first argument. A JavaScript `number` will be a `double` in C++.
  //double arg = info[0]->NumberValue();
  int32_t arg = info[0]->Int32Value(Nan::GetCurrentContext()).FromJust();

  hyppox_interface::Hyppox_Interface hi;

  std::string s = hi.getSrt(arg);
  v8::MaybeLocal<v8::String> retval = v8::String::NewFromUtf8(isolate, s.c_str());

  // Set the return value.
  info.GetReturnValue().Set(retval.ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context = exports->CreationContext();
  exports->Set(Nan::New("invoke").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(GetMessage)
                   ->GetFunction(context)
                   .ToLocalChecked());
}

NODE_MODULE(interface, Init);
