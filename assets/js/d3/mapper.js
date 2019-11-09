$(function () {
  function Mapper(maxFilter){
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
    this.filterCount = [];
    this.clusterCount = 0;
    this.hasIndexColumn = false;
    this.maxFilter = maxFilter;
    this.addIndex = 0;

    for(var i=1; i<=maxFilter; i++) this.filterCount.push(i);

    this.workspace = _common.getWorkSpace();
  }

  Mapper.prototype = {
    constructor: Mapper,

    reload: function(){
      if(this.workspace.wd.length>0){
        $("#btnWrkSpace").html("Change working directory");
        $("#lblWrkSpace").html("Selected working directory: <strong>" + this.workspace.wd + "</strong>");
        $("#fsFileSelect").css("display", "block");
        $("#fsLabel").html("Selected an input csv file from: <strong>" +
          this._path.join(this.workspace.wd,"Data","csv") +
          "</strong>. If there has no csv file then place your csv file in this location first then click on the button <strong>Choose a csv file</strong>. " +
          "Make the csv file <strong>correct formated</strong> to get proper mapper object. " +
          "Correct formats are as follows: <strong id='shCF'>show</strong><script>" +
            "$(\"#shCF\").click(function(){if($(this).html()===\"show\"){$(this).html(\"hide\");$(\".showhide\").show(1000);}else{$(this).html(\"show\");$(\".showhide\").hide(1000);}});" +
          "</script>");

          this.loadAllCsvFiles();
          this.loadAllJsonFiles();
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
      this.clusterCount = 0;
      this.hasIndexColumn = false;
      this.filterCount = [];
      this.addIndex = 0;

      for(var i=1; i<=this.maxFilter; i++) this.filterCount.push(i);
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

    getAllFiles: function(_folder){
      try {
        var files = this._fs.readdirSync(_folder);
        return files;
      }
      catch(err) {alert(err); return [];}
    },

    loadAllCsvFiles: function(){
      if(this.workspace && this._fs.existsSync(this.workspace.wd)){
        var _dir = this._path.join(this.workspace.wd, "Data", "csv");
        var files = this.getAllFiles(_dir);
        for(var i=0; i<files.length; i++){
          if(files[i].indexOf('.csv')>=0 || files[i].indexOf('.CSV')>=0){
              var ff = false;
              for(var j=0; j<this.workspace.files.length; j++){
                if(this.workspace.files[j].csv === files[i]){
                  ff = true;
                  break;
                }
              }

              if(!ff){
                this.workspace.files.push({csv:files[i], col:{index:true, header:[], dt:new Date().toString()}, json:[]});
              }
          }
        }
      }
    },

    // Get all JSON files
    loadAllJsonFiles: function(){
      if(this.workspace && this._fs.existsSync(this.workspace.wd)){
        var _dir = this._path.join(this.workspace.wd, "Data", "json");
        var _folderList = this.getAllFiles(_dir);

        for(var i=0; i<_folderList.length; i++){
          if(_folderList[i].indexOf(".")===-1){
            var _jList = this.getAllFiles(this._path.join(_dir,_folderList[i]));

            var csvIndex = -1;
            for(var j=0; j<this.workspace.files.length; j++){
              if(this.workspace.files[j].csv === (_folderList[i] + ".csv") || this.workspace.files[j].csv === (_folderList[i] + ".CSV")){
                csvIndex = j;
                //this.workspace.files[j].json = [];
                break;
              }
            }

            for(var j=0; j<_jList.length; j++){
              if(_jList[j].substring(0, 6)!="coord_" && (_jList[j].indexOf('.json')>=0 || _jList[j].indexOf('.JSON')>=0)){
                  if(csvIndex>-1 && this.workspace.files[csvIndex].json.indexOf(_jList[j])===-1){
                    this.workspace.files[csvIndex].json.push(_jList[j]);
                  }
              }
            }
          }
        }
        this._fs.writeFileSync(this._path.resolve(__dirname + "/wp.sp"), JSON.stringify(this.workspace));
      }
    },

    createWorkingDir: function(){
      var f = this.createDir(this._path.join(this.workspace.wd, "Data")) |
              this.createDir(this._path.join(this.workspace.wd, "Data", "csv")) |
              this.createDir(this._path.join(this.workspace.wd, "Data", "json")) |
              this.createDir(this._path.join(this.workspace.wd, "Data", "tmp"));

      if(!this._fs.existsSync(this._path.join(this.workspace.wd, "Data", "csv","PlantHeight.csv"))){
        this._fs.copyFileSync(this._path.join(__dirname, "dummy","PlantHeight.csv"), this._path.join(this.workspace.wd, "Data", "csv","PlantHeight.csv") );
      }

      var ff = false;
      for(var i=0; i<this.workspace.files.length; i++){
        if(this.workspace.files[i].csv==="PlantHeight.csv"){
          ff = true;
          break;
        }
      }

      if(!ff){
        console.log(this._path.join(__dirname, "dummy","PlantHeight.csv"));
        this.workspace.files.push({csv:"PlantHeight.csv", col:{index:true, header:[], dt:new Date().toString()}, json:[]});
        this._fs.writeFileSync(__dirname + '/wp.sp', JSON.stringify(this.workspace), 'utf8');
      }

      return f;
    },

    extractFileName: function(){
      //alert(this.fileNameWithPath);
      // /Users/methun/Sites/hyppox/Data/csv/PlantHeight_18.csv
      this.fileName = this._path.basename(this.fileNameWithPath);
      var fName = this.fileName.substr(0, this.fileName.length-4);
      this.createDir(this._path.join(this.workspace.wd, "Data", "json",fName));

      this.getColumnNameList();
    },

    getColumnNameList: function(){
      var dt = new Date();
      var ldt = new Date();
      var csvIndex = -1;

      for(var i=0; i<this.workspace.files.length; i++){
        if(this.fileName === this.workspace.files[i].csv){
          ldt = new Date(this.workspace.files[i].col.dt);
          csvIndex = i;
          break;
        }
      }

      if(csvIndex<0){
        csvIndex = 0;
        this.workspace.files.push({csv:this.fileName, col:{index:true, header:[], dt:new Date().toString()}, json:[]});// = this.fileName;
      }
      // Reload if the data loads before 5 mins
      if(this.workspace.files[csvIndex].col.header.length ===0 || Math.round((((dt-ldt) % 86400000) % 3600000) / 60000) > 5){
        var addon = require('bindings')('interface');
        var srt = JSON.parse(addon.invoke("RCSVH", this.fileNameWithPath));

        this.hasIndexColumn = srt.index;
        var i=0;
        //if(this.hasIndexColumn) i = 2; // Discard the first column to appear in the drop down list
        this.workspace.files[csvIndex].col.header = [];
        this.workspace.files[csvIndex].col.index = srt.index;
        this.workspace.files[csvIndex].col.dt = new Date().toString();

        for(; i<srt.header.length; i++){
          this.workspace.files[csvIndex].col.header.push(srt.header[i]);

          if(i==0 && this.hasIndexColumn) continue;

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
      }else{
        var srt = this.workspace.files[i].col;
        this.hasIndexColumn = srt.index;
        var i=0;
        //if(this.hasIndexColumn) i = 2; // Discard the first column to appear in the drop down list
        for(; i<srt.header.length; i++){
          if(i==0 && this.hasIndexColumn) continue;

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
      }
    },

    storeData: function(ofn){
      try{
        this._fs.writeFileSync(this._path.resolve(__dirname + "/tmp.sp"), JSON.stringify([{'csv':this._path.basename(this.fileNameWithPath), 'json':this._path.basename(ofn)}]));

        for(var i=0; i<this.workspace.files.length; i++){
          if(this.fileName === this.workspace.files[i].csv){
            if(this.workspace.files[i].json.indexOf(this._path.basename(ofn))===-1){
              this.workspace.files[i].json.push(this._path.basename(ofn));
            }

            break;
          }
        }

        this._fs.writeFileSync(this._path.resolve(__dirname + "/wp.sp"), JSON.stringify(this.workspace));
      }catch(err){
        console.log("Error to write data at storeData: " + err.message);
      }
    },

    checkMapperParams: function(nesVal){
      var errStatus = {status:true, msg:[]};

      if(nesVal.filter.length===0){
          errStatus.status = false;
          errStatus.msg.push("Please select a filter attibute");
      }else if(nesVal.filter.length===1 && parseInt(nesVal.filter[0])===-1){
          errStatus.status = false;
          errStatus.msg.push("Please select a filter attibute");
      }

      if(nesVal.cluster_attr.length===0){
        errStatus.status = false;
        errStatus.msg.push("Please select a cluster attribute");
      }

      for(var i=0; i<nesVal.cluster_param.length; i++){
        if(nesVal.cluster_param[i].length===0 || parseFloat(nesVal.cluster_param[i])===0){
          if(nesVal.cluster_algo==="DBSCAN"){
            if(i==0){
              errStatus.status = false;
              errStatus.msg.push("Radius should be non-zero.");
            }else if(i==1){
              errStatus.status = false;
              errStatus.msg.push("Density should be non-zero.");
            }
          }
        }
      }

      return errStatus;
    },

    getHeaderName: function(index, header){
      index = parseInt(index);
      for(var i=1; i<=header.length; i++){
        if(parseInt(header[i-1].index) === index){
          return header[i-1].name;
        }
      }

      return "";
    },

    createMapper: function(nesVal){
      var param = [];

      param.push("-RD");
      param.push(this._path.join(this.workspace.wd, "Data" , "csv"));
      param.push("-WD");
      param.push(this._path.join(this.workspace.wd, "Data" , "json"));
      param.push("-FN");
      param.push(this.fileName);
      param.push("-FC");

      // Get the header list  and create file name using that List
      // If file alread exists then pull it otherwise run mapper
      _header_names = [];
      for(var i=0; i<this.workspace.files.length; i++){
        if(this.workspace.files[i].csv===this.fileName){
          _header_names = this.workspace.files[i].col.header;
          break;
        }
      }

      /*
      {
        "filter" : [],
        "filter_gen":[],
        "window" : [],
        "overlap" : [],
        "cluster_algo": "DBSCAN",
        "cluster_attr": [],
        "cluster_param": [],
        "pie_attr": [],
        "mem_attr":[],
        "ref_perf_index":0
      }
      */

      var fName = "";
      var s = "[";
      for(var i=0; i<nesVal.filter.length; i++){
        if(s.length>1) s += ",";
        if(i>0) fName += "|";
        s += nesVal.filter[i];
        fName += this.getHeaderName(nesVal.filter[i], _header_names);
      }
      s += "]";
      fName += "_";
      param.push(s);

      param.push("-WX");
      s = "[";
      for(var i=0; i<nesVal.window.length; i++){
        if(s.length>1) s += ",";
        if(i>0) fName += "|";
        s += nesVal.window[i];
        fName += nesVal.window[i];
      }
      s += "]";
      fName += "_";
      param.push(s);

      param.push("-GX");
      s = "[";
      for(var i=0; i<nesVal.overlap.length; i++){
        if(s.length>1) s += ",";
        if(i>0) fName += "|";
        s += nesVal.overlap[i];
        fName += parseFloat(nesVal.overlap[i]).toFixed(2);
      }
      s += "]";
      fName += "_";
      param.push(s);

      param.push("-CP");
      s = "[";
      fName += nesVal.cluster_algo + "|";
      for(var i=0; i<nesVal.cluster_param.length; i++){
        if(s.length>1) s += ",";
        if(i>0) fName += "|";
        s += nesVal.cluster_param[i];

        if(i==0 && nesVal.cluster_algo==="DBSCAN"){
          fName += parseFloat(nesVal.cluster_param[i]).toFixed(2);
        }else{
          fName += nesVal.cluster_param[i];
        }
      }
      s += "]";
      fName += "_";
      param.push(s);

      param.push("-CC");

      s = "[";
      for(var i=0; i<nesVal.cluster_attr.length; i++){
        if(s.length>1) s += ",";
        if(i>0) fName += "|";
        s += nesVal.cluster_attr[i];
        fName += this.getHeaderName(nesVal.cluster_attr[i], _header_names);
      }
      s += "]";
      fName += "_";
      param.push(s);

      if(nesVal.filter_gen.length>0){
        param.push("-FG");

        s = "[";
        for(var i=0; i<nesVal.filter_gen.length; i++){
          if(s.length>1) s += ",";
          if(i>0) fName += "|";
          s += nesVal.filter_gen[i];
          fName += nesVal.filter_gen[i];
        }
        s += "]";
        fName += "_";
        param.push(s);
      }

      fName += "_";

      fName += this.getHeaderName(nesVal.cluster_attr[nesVal.ref_perf_index], _header_names);;

      if(nesVal.mem_attr.length > 0){
        param.push("-MEMC");
        s = "[";
        fName += "_";
        for(var i=0; i<nesVal.mem_attr.length; i++){
          if(s.length>1) s += ",";
          if(i>0) fName += "|";
          s += nesVal.mem_attr[i];
          fName += nesVal.mem_attr[i];
        }
        s += "]";
        param.push(s);
      }

      if(nesVal.pie_attr.length > 0){
        param.push("-PIEC");
        s = "[";
        fName += "_";
        for(var i=0; i<nesVal.pie_attr.length; i++){
          if(s.length>1) s += ",";
          if(i>0) fName += "|";
          s += nesVal.pie_attr[i];
          fName += nesVal.pie_attr[i];
        }
        s += "]";
        param.push(s);
      }

      fName += ".json";

      var chkFN = this._path.join(this.workspace.wd,"Data", "json", this.fileName.split(".")[0], fName);
      console.log(chkFN);
      if(this._fs.existsSync(chkFN)){
        this.storeData(chkFN);
      }else{
        var addon = require('bindings')('interface');
        var srt = addon.invoke("CRTMAPR", param);

        this.storeData(srt);
      }
    },

    addFilter: function(){
      if(this.filterCount.length === 0) return "";

      this.addIndex = this.filterCount.pop();
      if(this.filterCount.length === 0){
        $("#addFilter").css("display", "none");
      }

      var s = "<div id='filter_" + this.addIndex + "' class='rowDiv'>" +
                "<div class='selCol'>" +
                    "<label>Select a filter</label>" +
                    "<select id='selFilter_" + this.addIndex + "' class='filterSel'>" +
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
                    "<input type='range' min='1' max='100' value='50' step='1' class='slider' id='myRangeWin_" + this.addIndex + "' index='" + this.addIndex + "'/>&nbsp;" +
                    "<label id='winLabel_" + this.addIndex + "'>50</label>" +
                  "</div>" +
                  "<div id='ceWin_" + this.addIndex + "'>" +
                    "<label>Custom entry</label>" +
                    "<input type='text' id='txtWin_" + this.addIndex + "' placeholder='0' value='0' type='number' onkeypress='return isNumberKey(event)' />" +
                  "</div>" +
                "</div>" +
                "<div class='ovCol'>" +
                  "<div>" +
                    "<label>Select overlaps</label>" +
                    "<input type='range' min='1' max='50' value='25' step='1' class='slider' id='myRangeOv_" + this.addIndex + "' index='" + this.addIndex + "'/>&nbsp;" +
                    "<label id='ovLabel_" + this.addIndex + "'>25%</label>" +
                  "</div>" +
                  "<div id='ceOv_" + this.addIndex + "'>" +
                    "<label>Custom entry</label>" +
                    "<input type='text' id='txtOv_" + this.addIndex + "' placeholder='0' value='0' onkeypress='return isFloatingNumberKey(event, this)' />" +
                  "</div>" +
                "</div>" +
                "<div class='delCol'>" +
                  "<span id='delFilter_" + this.addIndex + "' index='" + this.addIndex + "'><i class='fas fa-minus-square' aria-hidden='true'></i>&nbsp;Delete</span>" +
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
      				"var $select = $('#select-state').selectize({" +
      					"plugins: ['remove_button']," +
      					"create          : true," +
                "placeholder     : 'Select a clustering attributes'," +
      				"});" +
      				"</script>";

      return s;
    },

    getPieAttributes: function(){
      var s = "<div class='ddiv' id='pieDiv'><label>Select attributes for pie chart</label>" +
              "<select id='pie-select-state' multiple name='state[]' class='demo-default' style='width:50%'>";
              console.log("total cols: " + this.colNames.length);
      for(var i=0; i<this.colNames.length; i++){
        s += "<option value='" + this.colIndex[i] + "'>" + this.colNames[i] + "</option>";
      }

      s += "</select>" +
            "<script>" +
      				"var $select = $('#pie-select-state').selectize({" +
      					"plugins: ['remove_button']," +
      					"create          : true," +
                "placeholder     : 'Select pie chart attributes'," +
      				"});" +
      				"</script></div>";

      return s;
    },

    getMembershipAttributes: function(){
      var s = "<div class='ddiv' id='memDiv'><label>Select attributes for flare membership</label>" +
              "<select id='mem-select-state' multiple name='state[]' class='demo-default' style='width:50%'>";

                  for(var i=0; i<this.colNames.length; i++){
                    s += "<option value='" + this.colIndex[i] + "'>" + this.colNames[i] + "</option>";
                  }

                s += "</select>" +
                      "<script>" +
                				"var $select = $('#mem-select-state').selectize({" +
                					"plugins: ['remove_button']," +
                					"create          : true," +
                          "placeholder     : 'Select membership attributes for flare'," +
                				"});" +
                				"</script></div>";

      return s;
    },

    getClusteringParams: function(){
      var s = "<label id=\"ccLabel\">Select a clustering algorithm and its associated parameters</label>" +
            "<div id=\"clusterParam\">" +
              "<div class=\"selCol\">" +
                "<select id=\"selCluster\" class=\"clusterSel\">" +
                  "<option value=\"-1\">Select a clustering method</option>" +
                  "<option value=\"DBSCAN\" selected>DBScan</option>" +
                "</select>" +
              "</div>" +
              "<div class=\"winCol\">" +
                "<div class=\"dens\">" +
                  "<label>Density</label>" +
                  "<input type=\"text\" id=\"txtDensity\" placeholder=\"4\" value=\"4\" onkeypress='return isFloatingNumberKey(event, this)' />" +
                "</div>" +
              "</div>" +
              "<div class=\"ovCol\">" +
                "<div class=\"rads\">" +
                  "<label>Radius</label>" +
                  "<input type=\"text\" id=\"txtRadius\" placeholder=\"1\" value=\"1\" onkeypress='return isFloatingNumberKey(event, this)' />" +
                "</div>" +
              "</div>" +
            "</div>";

      return s;
    },

    getAdvanceAttributes: function(){
      var s = this.getClusteringParams();// + this.getPieAttributes() + this.getMembershipAttributes();
      return s;
    }

  };

  $("#advance legend").click(function(){
    if($("#advance legend i").hasClass("fa-plus-circle")){
      $("#advance legend i").removeClass("fa-plus-circle");
      $("#advance legend i").addClass("fa-minus-circle");
      $("#advContainer").show(1000);
    }else {
      $("#advance legend i").removeClass("fa-minus-circle");
      $("#advance legend i").addClass("fa-plus-circle");
      $("#advContainer").hide(1000);
    }
  });

  $("#btnWrkSpace").click(function(){
    const {dialog} = require('electron').remote;
    dialog.showOpenDialog({
          properties: ['openDirectory'],
          createDirectory: true
      }, function (files) {
          if (files === undefined) return;
          if(files.length===0) return;

          _mapper.workspace.wd = files[0];

          if(_mapper.createWorkingDir()){
            _mapper.reload();

            alert("Please store all input csv files at: \"" + _mapper._path.join(_mapper.workspace.wd, "Data", "csv") + "\"");
          }else{
            alert("Can not create working directory in this location. Please select a different location.");
          }
      });
  });

  $("#file-input").on("click", (e)=>{
    showBusyIndicator();

    const {width, height, x, y} = require('electron').remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds();
    //$("#busyDiv").css("height", height+"px");
    //$("#busyDiv").css("width", width+"px");
    $("#scrollDiv").css("height", (height-30)+"px");

    const {dialog} = require('electron').remote;
    dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'CSV', extensions: ['csv'] }],
          defaultPath: _mapper._path.join(_mapper.workspace.wd, "Data", "csv")
      }, function (files) {

          if (files === undefined ) {hideBusyIndicator(); return;}
          if(files.length === 0) {hideBusyIndicator(); return;}

          _mapper.reset();
          _mapper.fileNameWithPath = files[0];
          _mapper.extractFileName();

          $("#lblFileName").html(_mapper.fileName);
          $("#fsFilterParams").css("display", "block");
          $("#fsClusterParams").css("display", "block");
          $("#advance").css("display", "block");
          $("#btnCrMpr").css("display", "block");
          $("#filterContainer").html("");
          $("#clusterContainer").html(_mapper.getClusteringAttributes());
          $("#advContainer").html(_mapper.getAdvanceAttributes());

          hideBusyIndicator();
      });
  });

  $("#addFilter").on("click", (e)=>{
    $("#filterContainer").css("display", "block");
    var s = _mapper.addFilter();
    if(s.length>0) $("#filterContainer").append(s);

    // Custom css
    $("#myRangeWin_" + _mapper.addIndex + "").css({"width": "80%", "background-color": "burlywood"});
    $("#myRangeOv_" + _mapper.addIndex + "").css({"width": "80%", "background-color": "burlywood"});
    $("#winLabel_" + _mapper.addIndex + "").css({"width": "18%", "display": "contents"});
    $("#ovLabel_" + _mapper.addIndex + "").css({"width": "18%", "display": "contents"});
    $("#ceWin_" + _mapper.addIndex + " label").css({"width": "30%", "float": "left", "padding-top": "8pt"});
    $("#ceOv_" + _mapper.addIndex + " label").css({"width": "30%", "float": "left", "padding-top": "8pt"});
    $("#txtWin_" + _mapper.addIndex + "").css({"width": "50%", "float": "left"});
    $("#txtOv_" + _mapper.addIndex + "").css({"width": "50%", "float": "left"});
    $("#delFilter_" + _mapper.addIndex + "").css({"margin-left": "1em", "cursor": "pointer", "font-size": "18px", "color": "sandybrown"});
    $("#delFilter_" + _mapper.addIndex + " i").css({"font-size": "18px", "color": "sandybrown"});

    // Custom events
    $("#myRangeWin_" + _mapper.addIndex + "").on('input',function(){
      $("#winLabel_" + $(this).attr("index") + "").html($(this).val());
    });

    $("#myRangeOv_" + _mapper.addIndex + "").on("input",function(){
      $("#ovLabel_" + $(this).attr("index") + "").html($(this).val() + "%");
    });

    $("#delFilter_" + _mapper.addIndex + "").on("click", function(){
      alert("x=" + $(this).attr("index"));
      $("#filter_"+$(this).attr("index")).remove();

      _mapper.filterCount.push(parseInt($(this).attr("index")));
      $("#addFilter").css("display", "block");
    });
  });

  $("#btnCrMpr").click(function(){
    showBusyIndicator();

    var nesVal = {
      "filter" : [],
      "filter_gen":[],
      "window" : [],
      "overlap" : [],
      "cluster_algo": "DBSCAN",
      "cluster_attr": [],
      "cluster_param": [],
      "pie_attr": [],
      "mem_attr":[],
      "ref_perf_index":0
    };

    for(var i=1; i<=_mapper.maxFilter; i++){
      if(_mapper.filterCount.indexOf(i)===-1){
        nesVal.filter.push($("#selFilter_" + i + " option:selected").val());

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
    }

    nesVal.cluster_attr = $('#clusterContainer div.item').map((i, el) => el.getAttribute('data-value')).get();
    nesVal.cluster_algo = $("#selCluster option:selected").val();
    // radius then density
    nesVal.cluster_param.push($("#txtRadius").val());
    nesVal.cluster_param.push($("#txtDensity").val());

    // From advance options
    nesVal.pie_attr = $('#pieDiv div.item').map((i, el) => el.getAttribute('data-value')).get();
    nesVal.mem_attr = $('#memDiv div.item').map((i, el) => el.getAttribute('data-value')).get();

    var errStatus = _mapper.checkMapperParams(nesVal);
    const {dialog, nativeImage} = require('electron').remote;
    const path = require('path');

    console.log(path.join(__dirname, 'Icon.png'));
    let nativeIcon = nativeImage.createFromPath(path.join(__dirname, 'Icon.png'));
    nativeIcon = nativeIcon.resize({ width: 16, height: 16 });
    //const tray = new Tray(trayIcon);

    if(errStatus.status===true){
      let options  = {
         buttons: ["Yes", "No"],
         message: "Do you want to create the mapper with this settings.",
         icon: nativeIcon
       };

       dialog.showMessageBox(options,(response) => {
              console.log(response);

              if(response===0){
                _mapper.createMapper(nesVal);
                var mWin = require('electron').remote.getCurrentWindow();
                mWin.close();
              }
          });
    }else{
      var s = "Please fix following issues:\n";
      for(var i=0; i<errStatus.msg.length; i++){
        if(i>0) s+= "\n";
        s += "\t" + (i+1) + ". " + errStatus.msg[i] + ".";
      }

      let options  = {
         buttons: ["Ok"],
         message: s,
         icon: nativeIcon
       };

       dialog.showMessageBox(options,(response) => {
          console.log(response);
      });
    }

    hideBusyIndicator();
  });

  var _common = new CommonOps();
  var _mapper = new Mapper(2);

  _mapper.reload();

  $(".showhide").hide();
  $("#advContainer").hide();

});

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
