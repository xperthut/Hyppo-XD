function CommonOps(){
  this._electron = require('electron');
  this._fs = require('fs');
  this._path = require("path");
}

CommonOps.prototype={
  constructor: CommonOps,

  // Load the getWorkSpace
  getWorkSpace: function(){
    try {
      return JSON.parse(this._fs.readFileSync(this._path.resolve(__dirname + "/wp.sp"), 'utf-8'));
    }catch(err) {return {wd:"", files:[]};}
  },

  saveWorkSpace: function(wp){
    try {
      this._fs.writeFileSync(this._path.resolve(__dirname + "/wp.sp"), JSON.stringify(wp));
    }catch(err) {
      console.log("Can not write working directory JSON: " + err.message);
    }
  }
};

function showBusyIndicator(){
  $("#busyDiv").css("display", "block");
  console.log("Start busy indicator");
}

function hideBusyIndicator(){
  $("#busyDiv").css("display", "none");
  console.log("Stop busy indicator");
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function isFloatingNumberKey(evt, e){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)){
      if(charCode===46){
        if(e.value.indexOf(".")>=0) return false;
        else return true;
      }
      return false;
    }
    return true;
}

//onkeyup='return deleteKeyPress(event, this)'
function deleteKeyPress(evt, e){
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if(charCode === 46 || charCode === 8){
    if(e.value.length<2) e.value='0';
  }
}
