function Mapper(){
  this._fs = require('fs');
  this.fileNameWithPath="";
  this.fileName = "";
}

Mapper.prototype = {
  constructor: Mapper,

  extractFileName: function(){
    //alert(this.fileNameWithPath);
    // /Users/methun/Sites/hyppox/Data/csv/PlantHeight_18.csv
    var path = require("path");
    this.fileName = path.basename(this.fileNameWithPath);
  },

  getColumnNameList: function(){
    var addon = require('bindings')('interface');
    var srt = addon.invoke("RCSVH", this.fileNameWithPath);

    return srt;
  }


};

var _mapper = new Mapper();

$("#file-input").on("click", (e)=>{
  const {dialog} = require('electron').remote;
  dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory'],
        filters: [{ name: 'CSV', extensions: ['csv'] }]
    }, function (files) {
        if (files === undefined) return;
        _mapper.fileNameWithPath = files[0];
        _mapper.extractFileName();
        $("#lblFileName").html(_mapper.getColumnNameList());
    });
});
