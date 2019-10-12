function Mapper(){
  this._fs = require('fs');
  this.fileNameWithPath="";
  this.fileName = "";
  this.colNames = [];
  this.colIndex = [];
  this.selectedFilter = [];
  this.filterCount = 0;
  this.hasIndexColumn = false;
}

Mapper.prototype = {
  constructor: Mapper,

  reset: function(){
    this.fileNameWithPath="";
    this.fileName = "";
    this.colNames = [];
    this.colIndex = [];
    this.selectedFilter = [];
    this.filterCount = 0;
    this.hasIndexColumn = false;
  },

  extractFileName: function(){
    //alert(this.fileNameWithPath);
    // /Users/methun/Sites/hyppox/Data/csv/PlantHeight_18.csv
    var path = require("path");
    this.fileName = path.basename(this.fileNameWithPath);
    this.getColumnNameList();
  },

  getColumnNameList: function(){
    var addon = require('bindings')('interface');
    var srt = JSON.parse(addon.invoke("RCSVH", this.fileNameWithPath));

    this.hasIndexColumn = srt.index;
    for(var i=0; i<srt.header.length; i+=2){
      this.colIndex.push(parseInt(srt.header[i]));
      this.colNames.push(srt.header[i+1]);
    }
  },

  addFilter: function(max){
    if(this.filterCount >= max){
      alert("Our system allows at most 2D filter.");
      return "";
    }
    this.filterCount++;

    var s = "<div id='filter_" + this.filterCount + "' class='rowDiv'>" +
              "<div class='selCol'>" +
                  "<label>Select a filter</label>" +
                  "<select id='selFilter' class='filterSel'>" +
                    "<option value='-1'>Select a dimension</option>";

                    for(var i=0; i<this.colNames.length; i++){
                      if(this.selectedFilter.length>0 && this.selectedFilter.indexOf(this.colNames[i])>=0){
                        continue;
                      }

                      s += "<option value='" + this.colIndex[i] + "'>" + this.colNames[i] + "</option>";
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
                  "<input type='text' id='txtWin_" + this.filterCount + "' />" +
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
                  "<input type='text' id='txtOv_" + this.filterCount + "' />" +
                "</div>" +
              "</div>" +
              "<div class='delCol'>" +
                "<span id='delFilter_" + this.filterCount + "' index='" + this.filterCount + "'><i class='fas fa-minus-square' aria-hidden='true'></i>&nbsp;Delete</span>" +
              "</div>" +
            "</div>";

    return s;
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

        _mapper.reset();
        _mapper.fileNameWithPath = files[0];
        _mapper.extractFileName();

        $("#lblFileName").html(_mapper.fileName);
        $("#fsFilterParams").css("display", "block");
        $("#filterContainer").html("");
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
