#include <nan.h>
#include <hyppox.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

// For details reference, search here: https://v8docs.nodesource.com/node-12.0/index.html
// v8 version: node -p process.versions.v8

void GetMessage(const v8::FunctionCallbackInfo<v8::Value>& info) {
  std::cout<<"In adons"<<std::endl;
  v8::Isolate* isolate = info.GetIsolate();

  // Validate the number of arguments.
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Arity mismatch");
    return;
  }

  // First argument is always an instruction string
  //v8::Local<v8::String> tvs = v8::Local<v8::String>::Cast(info[0]);
  v8::String::Utf8Value vs(isolate, info[0]); // take the string arg and convert it to v8::string
  std::string str(*vs); // take the v8::string convert it to c++ class string

  // Variables for operation
  std::string s = "Invalid arguments";
  hyppox_interface::Hyppox_Interface hi;

  /* Instruction codes are:
      SQRT: compute squre root
      RCSVH: Read the csv file headerNames
      CCSVADD: Copy CSV file after adding the first row as index columns
      CRTMAPR: Create mapper object
  */
  if(str.compare("SQRT")==0){
    // Validate the type of the second argument.
    if (!info[1]->IsNumber()) {
      Nan::ThrowTypeError("Argument must be a number");
      return;
    }

    // Get the number value of the first argument. A JavaScript `number` will be a `double` in C++.
    //double arg = info[0]->NumberValue();
    int32_t arg = info[1]->Int32Value(Nan::GetCurrentContext()).FromJust();
    s = hi.getSrt(arg);

  }else if(str.compare("RCSVH")==0){
    // Validate the type of the second argument.
    if (!info[1]->IsString()) {
      Nan::ThrowTypeError("Argument must be a string");
      return;
    }

    v8::String::Utf8Value tfnwp(isolate, info[1]); // take the string arg and convert it to v8::string
    std::string fnwp(*tfnwp);

    s = hi.getFileHeader(fnwp);
  }else if(str.compare("CCSVADD")==0){

  }else if(str.compare("CRTMAPR")==0){
    // Validate the type of the second argument.
    /*if (!info[1]->IsNumber()) {
      Nan::ThrowTypeError("Argument must be a number");
      return;
    }*/

    if (!info[1]->IsArray()) {
      Nan::ThrowTypeError("Argument must be a number");
      return;
    }

    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(info[1]);

    std::vector<std::string> param;
    //std::cout<<"Entering loop of length:"<<jsArr->Length()<<std::endl;
    for (uint32_t i = 0; i < jsArr->Length(); i++) {
      // For Node 10X
      //v8::Local<v8::Value> jsElement = jsArr->Get(i);
      v8::Local<v8::Value> jsElement = Nan::Get(jsArr, i).ToLocalChecked();

      v8::String::Utf8Value tps(isolate, jsElement); // take the string arg and convert it to v8::string
      std::string ps(*tps);

      std::cout<<ps<<std::endl;

      param.push_back(ps);
    }

    s = hi.callHyppoX(param);
  }

  v8::MaybeLocal<v8::String> retval = v8::String::NewFromUtf8(isolate, s.c_str(), v8::NewStringType::kNormal, static_cast<int>(s.length()));

  // Set the return value.
  info.GetReturnValue().Set(retval.ToLocalChecked());
}

// Check https://nodejs.org/dist/latest-v12.x/docs/api/addons.html for correct syntex
// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/*Local<Object> exports, Local<Value> module, Local<Context> context*/) {
  Isolate* isolate = context->GetIsolate();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "GetMessage").ToLocalChecked(),
               FunctionTemplate::New(isolate, GetMessage, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
