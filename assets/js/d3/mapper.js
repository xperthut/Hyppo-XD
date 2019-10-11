function Mapper(){
  this._fs = require('fs');
  this.fileNameWithPath="";
  this.fileName = "";
  this.colNames = [];
  this.colIndex = [];
  this.selectedFilter = [];
  this.filterCount = 0;
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

    for(var i=0; i<srt.length; i+=2){
      this.colIndex.push(parseInt(srt[i]));
      this.colNames.push(srt[i+1]);
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
                  "<input type='range' min='1' max='100' value='50' step='1' class='slider' id='myRangeWin' />&nbsp;" +
                  "<label id='winLabel'>50</label>" +
                "</div>" +
                "<div id='ceWin'>" +
                  "<label>Custom entry</label>" +
                  "<input type='text' id='txtWin' />" +
                "</div>" +
              "</div>" +
              "<div class='ovCol'>" +
                "<div>" +
                  "<label>Select overlaps</label>" +
                  "<input type='range' min='1' max='50' value='25' step='1' class='slider' id='myRangeOv' />&nbsp;" +
                  "<label id='ovLabel'>25%</label>" +
                "</div>" +
                "<div id='ceOv'>" +
                  "<label>Custom entry</label>" +
                  "<input type='text' id='txtOv' />" +
                "</div>" +
              "</div>" +
              "<div class='delCol'>" +
                "<span class='delFilter' index='" + this.filterCount + "'><i class='fas fa-minus-square' aria-hidden='true'></i>&nbsp;Delete</span>" +
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
});

$("#myRangeWin").change(function(){
  $("#winLabel").html($(this).val());
});

$("#myRangeOv").change(function(){
  $("#ovLabel").html($(this).val() + "%");
});

$(".delFilter").on("click", function(){
  alert("x=" + $(this).attr("index"));
});
