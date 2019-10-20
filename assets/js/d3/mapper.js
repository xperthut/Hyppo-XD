function Mapper(){
  this._electron = require('electron');
  this._fs = require('fs');
  this._path = require("path");

  this.fileNameWithPath="";
  this.fileName = "";
  this.colNames = [];
  this.colIndex = [];
  this.numericColNames = [];
  this.numericColIndex = [];
  this.selectedFilter = [];
  this.filterCount = 0;
  this.clusterCount = 0;
  this.hasIndexColumn = false;
  this.workspace = "";

  this.getWorkSpace();
}

Mapper.prototype = {
  constructor: Mapper,

  // Load the getWorkSpace
  getWorkSpace: function(){
    try {
      this.workspace = this._fs.readFileSync(this._path.resolve(__dirname + "/wp.sp"), 'utf-8');
    }catch(err) {this.workspace = "";}
  },

  reload: function(){
    if(this.workspace.length>0){
      $("#btnWrkSpace").html("Change workspace");
      $("#lblWrkSpace").html("Selected workspace directory: <strong>" + this.workspace + "</strong>");
      $("#fsFileSelect").css("display", "block");
      $("#fsLabel").html("Selected a csv file from: <strong>" + this._path.join(this.workspace,"Data","csv") + "</strong>. If there has no csv file then place your csv file in this location first then click on the button <strong>Choose a csv file</strong>. Make the csv file correct formated.");
    }
  },

  reset: function(){
    this.fileNameWithPath="";
    this.fileName = "";
    this.colNames = [];
    this.colIndex = [];
    this.numericColNames = [];
    this.numericColIndex = [];
    this.selectedFilter = [];
    this.filterCount = 0;
    this.clusterCount = 0;
    this.hasIndexColumn = false;
  },

  createDir: function(loc){
    if(!this._fs.existsSync(loc)){
      try{
        this._fs.mkdirSync(loc);
        this._fs.chmodSync(loc, 0777);

        return true;
      }catch(err){
        alert("error: " + err.message);
        return false;
      }
    }

    return true;
  },

  createWorkingDir: function(){
    if(this.createDir(this._path.join(this.workspace, "Data"))){
      this.createDir(this._path.join(this.workspace, "Data", "csv"));
      this.createDir(this._path.join(this.workspace, "Data", "json"));
      this.createDir(this._path.join(this.workspace, "Data", "tmp"));

      this._fs.writeFileSync(__dirname + '/wp.sp', this.workspace, 'utf8');

      return true;
    }

    return false;
  },

  extractFileName: function(){
    //alert(this.fileNameWithPath);
    // /Users/methun/Sites/hyppox/Data/csv/PlantHeight_18.csv
    this.fileName = this._path.basename(this.fileNameWithPath);
    var fName = this.fileName.substr(0, this.fileName.length-4);
    this.createDir(this._path.join(this.workspace, "Data", "json",fName));

    this.getColumnNameList();
  },

  getColumnNameList: function(){
    var addon = require('bindings')('interface');
    var srt = JSON.parse(addon.invoke("RCSVH", this.fileNameWithPath));

    this.hasIndexColumn = srt.index;
    var i=0;
    //if(this.hasIndexColumn) i = 2; // Discard the first column to appear in the drop down list

    for(; i<srt.header.length; i++){
      var index = srt.header[i].index;
      var name = srt.header[i].name;
      var type = srt.header[i].numeric;

      this.colIndex.push((this.hasIndexColumn)?parseInt(index):1+parseInt(index));
      this.colNames.push(name);

      if(type){
        this.numericColIndex.push((this.hasIndexColumn)?parseInt(index):1+parseInt(index));
        this.numericColNames.push(name);
      }
    }
  },

  storeData: function(ofn){
    try{
      this._fs.writeFileSync(this._path.resolve(__dirname + "/tmp.sp"), JSON.stringify([{'csv':this._path.basename(this.fileNameWithPath), 'json':this._path.basename(ofn)}]));
    }catch(err){
      console.log("Error to write data at storeData: " + err.message);
    }
  },

  createMapper: function(nesVal){
    /*var nesVal = {
      "filter" : [],
      "window" : [],
      "overlap" : [],
      "cluster_algo": "DBSCAN",
      "cluster_attr": [],
      "cluster_param": []
    };*/

    var param = [];

    param.push("-RD");
    param.push(this._path.join(this.workspace, "Data" , "csv"));
    param.push("-WD");
    param.push(this._path.join(this.workspace, "Data" , "json"));
    param.push("-FN");
    param.push(this.fileName);
    param.push("-FC");

    if(nesVal.filter.length===0){
        alert("Please select a filter attibute");
        return false;
    }

    var s = "[";
    for(var i=0; i<nesVal.filter.length; i++){
      if(s.length>1) s += ",";
      s += nesVal.filter[i];
    }
    s += "]";
    param.push(s);

    param.push("-WX");
    s = "[";
    for(var i=0; i<nesVal.window.length; i++){
      if(s.length>1) s += ",";
      s += nesVal.window[i];
    }
    s += "]";
    param.push(s);

    param.push("-GX");
    s = "[";
    for(var i=0; i<nesVal.overlap.length; i++){
      if(s.length>1) s += ",";
      s += nesVal.overlap[i];
    }
    s += "]";
    param.push(s);

    param.push("-CC");

    if(nesVal.cluster_attr.length===0){
      alert("Please select a cluster attribute");
      return false;
    }

    s = "[";
    for(var i=0; i<nesVal.cluster_attr.length; i++){
      if(s.length>1) s += ",";
      s += nesVal.cluster_attr[i];
    }
    s += "]";
    param.push(s);

    param.push("-CP");
    s = "[";
    for(var i=0; i<nesVal.cluster_param.length; i++){
      if(nesVal.cluster_param[i].length===0 || parseFloat(nesVal.cluster_param[i])===0){
        if(nesVal.cluster_algo==="DBSCAN"){
          if(i==0){
            alert("Radius should be non-zero.");
            return false;
          }else if(i==0){
            alert("Density should be non-zero.");
            return false;
          }
        }
      }

      if(s.length>1) s += ",";
      s += nesVal.cluster_param[i];
    }
    s += "]";
    param.push(s);

    var addon = require('bindings')('interface');
    //var srt = addon.invoke("CRTMAPR", param.length, param[0],param[1],param[2],param[3],param[4],param[5],param[6],param[7],param[8],param[9],param[10],param[11],param[12],param[13],param[14],param[15]);
    var srt = addon.invoke("CRTMAPR", param);

    this.storeData(srt);

    return true;
  },

  addFilter: function(max){
    this.filterCount++;
    if(this.filterCount === max){
      $("#addFilter").css("display", "none");
    }

    var s = "<div id='filter_" + this.filterCount + "' class='rowDiv'>" +
              "<div class='selCol'>" +
                  "<label>Select a filter</label>" +
                  "<select id='selFilter_" + this.filterCount + "' class='filterSel'>" +
                    "<option value='-1'>Select a dimension</option>";

                    for(var i=0; i<this.numericColNames.length; i++){
                      if(this.selectedFilter.length>0 && this.selectedFilter.indexOf(this.numericColNames[i])>=0){
                        continue;
                      }

                      s += "<option value='" + this.numericColIndex[i] + "'>" + this.numericColNames[i] + "</option>";
                    }

                s += "</select>" +
              "</div>" +
              "<div class='winCol'>" +
                "<div>" +
                  "<label>Select windows</label>" +
                  "<input type='range' min='1' max='100' value='50' step='1' class='slider' id='myRangeWin_" + this.filterCount + "' index='" + this.filterCount + "'/>&nbsp;" +
                  "<label id='winLabel_" + this.filterCount + "'>50</label>" +
                "</div>" +
                "<div id='ceWin_" + this.filterCount + "'>" +
                  "<label>Custom entry</label>" +
                  "<input type='text' id='txtWin_" + this.filterCount + "' placeholder='0' value='0' type='number' onkeypress='return isNumberKey(event)' />" +
                "</div>" +
              "</div>" +
              "<div class='ovCol'>" +
                "<div>" +
                  "<label>Select overlaps</label>" +
                  "<input type='range' min='1' max='50' value='25' step='1' class='slider' id='myRangeOv_" + this.filterCount + "' index='" + this.filterCount + "'/>&nbsp;" +
                  "<label id='ovLabel_" + this.filterCount + "'>25%</label>" +
                "</div>" +
                "<div id='ceOv_" + this.filterCount + "'>" +
                  "<label>Custom entry</label>" +
                  "<input type='text' id='txtOv_" + this.filterCount + "' placeholder='0' value='0' onkeypress='return isFloatingNumberKey(event, this)' />" +
                "</div>" +
              "</div>" +
              "<div class='delCol'>" +
                "<span id='delFilter_" + this.filterCount + "' index='" + this.filterCount + "'><i class='fas fa-minus-square' aria-hidden='true'></i>&nbsp;Delete</span>" +
              "</div>" +
            "</div>";

    return s;
  },

  getClusteringAttributes: function(){
    var s = "<select id='select-state' multiple name='state[]' class='demo-default' style='width:50%'>";

                for(var i=0; i<this.numericColNames.length; i++){
                  s += "<option value='" + this.numericColIndex[i] + "'>" + this.numericColNames[i] + "</option>";
                }

              s += "</select>" +
                    "<script>" +
              				"var eventHandler = function(name) {" +
              					"return \"\";" +
              				"};" +
              				"var $select = $('#select-state').selectize({" +
              					"plugins: ['remove_button']," +
              					"create          : true," +
                        "placeholder     : 'Select a clustering attribute'," +
              					"onChange        : eventHandler('onChange')," +
              					"onItemAdd       : eventHandler('onItemAdd')," +
              					"onItemRemove    : eventHandler('onItemRemove')," +
              					"onOptionAdd     : eventHandler('onOptionAdd')," +
              					"onOptionRemove  : eventHandler('onOptionRemove')," +
              					"onDropdownOpen  : eventHandler('onDropdownOpen')," +
              					"onDropdownClose : eventHandler('onDropdownClose')," +
              					"onFocus         : eventHandler('onFocus')," +
              					"onBlur          : eventHandler('onBlur')," +
              					"onInitialize    : eventHandler('onInitialize')," +
              				"});" +
              				"</script>";

    return s;
  }

};

var _mapper = new Mapper();
_mapper.reload();

function showBusyIndicator(){
  $("#busyDiv").css("display", "block");
}

function hideBusyIndicator(){
  $("#busyDiv").css("display", "none");
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

$("#btnWrkSpace").click(function(){
  const {dialog} = require('electron').remote;
  dialog.showOpenDialog({
        properties: ['openDirectory'],
        createDirectory: true
    }, function (files) {
        if (files === undefined) return;
        if(files.length===0) return;

        _mapper.workspace = files[0];

        if(_mapper.createWorkingDir()){
          _mapper.reload();

          alert("Please store all csv files at: \"" + _mapper._path.join(_mapper.workspace, "Data", "csv") + "\"");
        }else{
          alert("Can not create working directory in this location. Please select different location.");
        }
    });
});

$("#file-input").on("click", (e)=>{

  const {width, height, x, y} = require('electron').remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds();
  $("#busyDiv").css("height", height+"px");
  $("#busyDiv").css("width", width+"px");

  const {dialog} = require('electron').remote;
  dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'CSV', extensions: ['csv'] }],
        defaultPath: _mapper._path.join(_mapper.workspace, "Data", "csv")
    }, function (files) {
        showBusyIndicator();

        if (files === undefined ) {hideBusyIndicator(); return;}

        if(files.length === 0) {hideBusyIndicator(); return;}

        _mapper.reset();
        _mapper.fileNameWithPath = files[0];
        _mapper.extractFileName();

        $("#lblFileName").html(_mapper.fileName);
        $("#fsFilterParams").css("display", "block");
        $("#fsClusterParams").css("display", "block");
        $("#btnCrMpr").css("display", "block");
        $("#filterContainer").html("");
        $("#clusterContainer").html(_mapper.getClusteringAttributes());

        hideBusyIndicator();
    });
});

$("#addFilter").on("click", (e)=>{
  $("#filterContainer").css("display", "block");
  var s = _mapper.addFilter(2);
  if(s.length>0) $("#filterContainer").append(s);

  // Custom css
  $("#myRangeWin_" + _mapper.filterCount + "").css({"width": "80%", "background-color": "burlywood"});
  $("#myRangeOv_" + _mapper.filterCount + "").css({"width": "80%", "background-color": "burlywood"});
  $("#winLabel_" + _mapper.filterCount + "").css({"width": "18%", "display": "contents"});
  $("#ovLabel_" + _mapper.filterCount + "").css({"width": "18%", "display": "contents"});
  $("#ceWin_" + _mapper.filterCount + " label").css({"width": "30%", "float": "left", "padding-top": "8pt"});
  $("#ceOv_" + _mapper.filterCount + " label").css({"width": "30%", "float": "left", "padding-top": "8pt"});
  $("#txtWin_" + _mapper.filterCount + "").css({"width": "50%", "float": "left"});
  $("#txtOv_" + _mapper.filterCount + "").css({"width": "50%", "float": "left"});
  $("#delFilter_" + _mapper.filterCount + "").css({"margin-left": "1em", "cursor": "pointer", "font-size": "18px", "color": "sandybrown"});
  $("#delFilter_" + _mapper.filterCount + " i").css({"font-size": "18px", "color": "sandybrown"});

  // Custom events
  $("#myRangeWin_" + _mapper.filterCount + "").change(function(){
    $("#winLabel_" + $(this).attr("index") + "").html($(this).val());
  });

  $("#myRangeOv_" + _mapper.filterCount + "").change(function(){
    $("#ovLabel_" + $(this).attr("index") + "").html($(this).val() + "%");
  });

  $("#delFilter_" + _mapper.filterCount + "").on("click", function(){
    alert("x=" + $(this).attr("index"));
  });
});

$("#btnCrMpr").click(function(){
  var nesVal = {
    "filter" : [],
    "window" : [],
    "overlap" : [],
    "cluster_algo": "DBSCAN",
    "cluster_attr": [],
    "cluster_param": []
  };

  for(var i=1; i<=_mapper.filterCount; i++){
    nesVal.filter.push($("#selFilter_"+i + " option:selected").val());

    var rv = 0;
    if($("#txtWin_"+i).val().length===0){
      rv = parseInt($("#myRangeWin_"+i).val());
    }else{
      rv = parseInt($("#txtWin_"+i).val());

      if(rv===0){
        rv = parseInt($("#myRangeWin_"+i).val());
      }
    }
    nesVal.window.push(rv);

    var rvv=0.0;
    if($("#txtOv_"+i).val().length===0){
      rvv = parseFloat($("#myRangeOv_"+i).val());
    }else{
      rvv = parseFloat($("#txtOv_"+i).val());

      if(rvv===0){
        rvv = parseFloat($("#myRangeOv_"+i).val());
      }
    }
    nesVal.overlap.push(rvv);
  }

  nesVal.cluster_attr = $('div.item').map((i, el) => el.getAttribute('data-value')).get();
  nesVal.cluster_algo = $("#selCluster option:selected").val();
  // radius then density
  nesVal.cluster_param.push($("#txtRadius").val());
  nesVal.cluster_param.push($("#txtDensity").val());

  if(_mapper.createMapper(nesVal)){
    var mWin = require('electron').remote.getCurrentWindow();
    mWin.close();
  }

});
