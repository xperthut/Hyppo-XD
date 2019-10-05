
function Html() {
  this.hasInternet();

  // Constant variables
  //this.elec = require('electron');
  this.fs = require('fs');
  //this.path = require('path');
  this.dir = "./Data/";
  this.randV = Math.round(Math.random()*1000000+1);
}

Html.prototype = {
  constructor: Html,

  hasInternet: function(){
    if(!navigator.onLine){
      //let modal = window.open('', 'modal');
      //modal.document.write('<h1>No internet connection</h1><br /><button id='btnModalClose' />');
      alert("No internet connection");
    }
  },

  // Get all JSON files
  getAllFiles: function(_folder){
    try {
      var files = this.fs.readdirSync(_folder);
      return files;
    }
    catch(err) {alert(err); return [];}
  },

  // Function to get all file names in a directory
  getAllCsvFiles: function(){
  	var _dir = this.dir + "csv";
    var files = this.getAllFiles(_dir);
    var flist = [];
    for(var i=0; i<files.length; i++){
      if(files[i].indexOf('.csv')>=0 || files[i].indexOf('.CSV')>=0){
          flist.push(files[i]);
      }
    }

    return flist;
  },

  // Get all JSON files
  getAllJsonFiles: function(){
    var _dir = this.dir + "json";
    var _folderList = this.getAllFiles(_dir);
    var _fList = [];
    for(var i=0; i<_folderList.length; i++){
      if(_folderList[i].indexOf(".")===-1){
        var _f={name:"", files:[]};
        _f.name = _folderList[i];
        _f.files = [];

        var _jList = this.getAllFiles(_dir+"/"+_folderList[i]);

        for(var j=0; j<_jList.length; j++){
          if(_jList[j].substring(0, 6)!="coord_" && (_jList[j].indexOf('.json')>=0 || _jList[j].indexOf('.JSON')>=0)){
              _f.files.push(_jList[j]);
          }
        }

        _fList.push(_f);
      }
    }

    return _fList;
  },

  createHeader: function(){
    document.write("<head><br />");
    document.write("<title>Hyppo-X</title><br />");
    document.write("<meta charset='utf-8' /><br />");
    document.write("<meta name='viewport' content='width=device-width, initial-scale=1' /><br />");
    document.write("<!--[if lte IE 8]><script src='./assets/js/ie/html5shiv.js'></script><![endif]--><br />");
    document.write("<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.0.8/css/all.css' /><br />");
    document.write("<link rel='stylesheet' href='./assets/css/main.css?t=" + this.randV + "' /><br />");
    document.write("<link rel='stylesheet' href='./assets/css/dropdown.css?t=" + this.randV + "' /><br />");
    document.write("<link rel='stylesheet' href='./assets/css/spectrum.css?t=" + this.randV + "' /><br />");
    document.write("<link rel='shortcut icon' href='./assets/logo.png' /><br />");
    document.write("<!--[if lte IE 8]><link rel='stylesheet' href='./assets/css/ie8.css?t=" + this.randV + "' /><![endif]--><br />");
    document.write("<!--[if lte IE 9]><link rel='stylesheet' href='./assets/css/ie9.css?t=" + this.randV + "' /><![endif]--><br />");
    document.write("<noscript><link rel='stylesheet' href='./assets/css/noscript.css?t=" + this.randV + "' /></noscript><br />");
    document.write("</head><br />");
  },

  /*
    obj = {
      type: 'hidden' or 'text',
      id: string,
      name: string,
      val: value
  };
  */
  createInput:function(obj){
    var s = "";
    for(var i=0; i<obj.length; i++){
      if(i>0) s += "<br />";
      s += "<input type='" + obj[i].type + "' id='" + obj[i].id + "' name='" + obj[i].name + "' value='" + obj[i].val + "' />";
    }

    return s;
  },

  /*
    obj={
      id: string,
      style: string,
      content: [{}]
  }
  */
  getForm: function(obj){
    var s = "<form style='" + obj.style + "' id='" + obj.id + "'><br />" +
        this.createInput(obj.content) + "</form>";

    return s;
  },

  createPieChartNav: function(){
    var s = "<!-- Drop down--><br /><nav id='top-nav' style='display: none'><br />" +
            "<ul class='dropdown-menu'><br />" +
            "<li><a id='pie_chart' href='javascript:void(0)'>Pie chart analysis</a></li><br />" +
            "</ul><br /></nav>";

    return s;
  },

  selectCsvFileSecion: function(){
    var s = "<!-- Select csv file --><br />" +
            "<section id='header'><br />" +
                "<div class='logohead'><br />" +
                    "<div class='dropdown'><br />" +
                        "<!--<button class='dropbtn' id='file_select'>Select a data file</button><br />" +
                        "<div id='myDropdown' class='dropdown-content'></div> --><br />" +
                        "<select class='dropdown-content' name='myDropdown' id='myDropdown' style='font-family:Arial, FontAwesome;'></select><br />" +
                    "</div><br />" +
                "</div><br />" +
            "</section><br />";

    return s;
  },

  selectJsonFileSecion: function(){
    var s = "<!-- Select JSON file --><br />" +
            "<section id='jsonheader'><br />" +
                "<div class='logohead'><br />" +
                    "<div class='dropdown'><br />" +
                        "<!--<button class='dropjbtn' id='file_json_select'>Select a graph file</button><br />" +
                        "<div id='myJsonDropdown' class='dropdown-content'></div>--><br />" +
                        "<select class='dropdown-content' name='myJsonDropdown' id='myJsonDropdown' style='font-family:Arial, FontAwesome;'></select><br />" +
                    "</div><br />" +
                "</div><br />" +
            "</section><br />";

    return s;
  },

  pieChartLegendSecion: function(){
    var s = "<!-- pie chart legends --><br />" +
            "<section id='pie-legend'><br />" +
                "<div class='legendhead'></div><br />" +
            "</section><br />";

    return s;
  },

  buttonSecion: function(){
    var s = "<!-- buttons --><br />" +
            "<section id='thumbnails'><br />" +
                "<div id='attr-btn'></div><br />" +
                "<div id='other-btn'></div><br />" +
            "</section><br />";

    return s;
  },

  attrControllerSecion: function(){
    var s = "<!-- attribute controller --><br />" +
            "<section id='attr-ctrl'><br />" +
                "<div id='attr-details'></div><br />" +
            "</section><br />";

    return s;
  },

  intPathSecion: function(){
    var s = "<!-- interesting paths --><br />" +
            "<section id='int-path'><br />" +
                "<div class='path-show show'><i class='fas fa-angle-double-up' id='fa-path-title'></i>&nbsp;Manage paths</div><br />" +
                "<div class='row1 row' id='path-details'></div><br />" +
            "</section><br />";

    return s;
  },

  intFlareSecion: function(){
    var s = "<!-- interesting flare --><br />" +
            "<section id='int-flare'><br />" +
                "<div class='flare-show show'><i class='fas fa-angle-double-up' id='fa-flare-title'></i>&nbsp;Manage flares</div><br />" +
                "<div class='row1 row' id='flare-details'></div><br />" +
            "</section><br />";

    return s;
  },

  subGraphSecion: function(){
    var s = "<!-- subgraphs --><br />" +
            "<section id='int-cc'><br />" +
                "<div class='cc-show show'><i class='fas fa-angle-double-up' id='fa-cc-title'></i>&nbsp;Manage subgraph</div><br />" +
                "<div class='row1 row' id='cc-details'></div><br />" +
            "</section><br />";

    return s;
  },

  nodeAnalysisSecion: function(){
    var s = "<!-- Node analysis --><br />" +
            "<section id='int-nodes'><br />" +
                "<div class='node-show show'><i class='fas fa-angle-double-up' id='fa-node-title'></i>&nbsp;Selected Nodes</div><br />" +
                "<div class='row1 row' id='node-details'><br />" +
                    "<fieldset><br />" +
                        "<legend>Selected Node IDs</legend><br />" +
                        "<span id='nIDs'></span><br />" +
                        "<button id='clearNIDs' style='display: none;'>Clear selection</button><br />" +
                    "</fieldset><br />" +
                    "<fieldset><br />" +
                        "<legend>Selected attributes</legend><br />" +
                        "<div class='dropdown'><br />" +
                            "<div id='colDropdown' class='dropdown-check-list'><br />" +
                                "<span class='anchor'>Select data attributes</span><ul class='items'></ul><br />" +
                            "</div><br />" +
                        "</div><br />" +
                        "<div id='attrList'><span>Selected attributes are: </span><ul></ul></div><br />" +
                    "</fieldset><br />" +
                    "<fieldset><br />" +
                        "<legend>Selected an action</legend><br />" +
                        "<button id='wdtf-btn'>Write data to file</button><br />" +
                    "</fieldset><br />" +
                "</div><br />" +
            "</section><br />";

    return s;
  },

  instructionSecion: function(){
    var s = "<section id='instruction'><br />" +
                "<div class='details'><br />" +
                    "<span>Instructions</span><br />" +
                    "<ol><br />" +
                        "<li>Select a CSV data file</li><br />" +
                        "<li>Select a graph file to visualize</li><br />" +
                        "<li>Mark/unmark to show/hide a connected component</li><br />" +
                        "<li>Mark/unmark to show/hide a paths</li><br />" +
                        "<li>Mark/unmark to show/hide a flares</li><br />" +
                        "<li>Click on color box to change the color</li><br />" +
                        "<li>Use mouse scroll or touch pad for pan and zoom.</li><br />" +
                        "<li>Mouse left click on a node and drag to change it's position.</li><br />" +
                        "<li>Mouse left click on a outside the graph and drag to change it's position.</li><br />" +
                        "<li>Mouse right click on a node to add/remove that node for further analysis.</li><br />" +
                    "</ol><br />" +
                "</div><br />" +
            "</section><br />";

    return s;
  },

  footer: function(){
    var s = "<!-- Footer --><br />" +
            "<footer id='footer'><br />" +
                "<ul class='copyright text-center'><br />" +
                    "<li>&copy; 2018&ndash;" + (new Date()).getFullYear() + " Methun</li><br />" +
                    "<li>Kamruzzaman</li><br />" +
                "</ul><br />" +
            "</footer>";

    return s;
  },

  createBody: function(){
    document.write("<body class='is-loading-0 is-loading-1 is-loading-2'><br />");
    document.write(this.getForm({
      id:"frm",
      style: "display: none",
      content: [
        {
          type:"hidden",
          id:"type",
          name:"type",
          val:""
        },
        {
          type:"hidden",
          id:"data",
          name:"data",
          val:""
        },
        {
          type:"hidden",
          id:"folderName",
          name:"folderName",
          val:""
        },
        {
          type:"hidden",
          id:"fileName",
          name:"fileName",
          val:""
        }
      ]
    }));
    document.write(this.createPieChartNav());
    document.write("<!-- Mouse over--><br /><div id='tooltip'></div><br />");
        document.write("<!-- Main --><br /><div id='main'><br />");
            document.write(this.selectCsvFileSecion());
            document.write(this.selectJsonFileSecion());
            document.write(this.pieChartLegendSecion());
            document.write(this.buttonSecion());
            document.write(this.attrControllerSecion());
            document.write(this.intPathSecion());
            document.write(this.intFlareSecion());
            document.write(this.subGraphSecion());
            document.write(this.nodeAnalysisSecion());
            document.write(this.instructionSecion());
            document.write(this.footer());
        document.write("</div><br />");

        document.write("<" + "!-- Scripts --><br />");
        document.write("<" + "script src='./assets/js/jquery.min.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/jquery.min.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/skel.min.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "!--[if lte IE 8]><" + "script src='./assets/js/ie/respond.min.js?t=" + this.randV + "'></script><![endif]--><br />");
        document.write("<" + "script src='./assets/js/main.js?t=" + this.randV + "'></script><br />");

        /*$('.toggle').click(function () {
            $('.caption').toggle();
        });*/

        document.write("<" + "script src='https://d3js.org/d3.v4.js'></script><br />");
        document.write("<" + "script src='./assets/js/d3/node-pie.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/d3/graph.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/d3-selection-multi.v1.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/spectrum.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='https://unpkg.com/d3-require@0.4.5/build/d3-require.js'></script><br />");
        document.write("<" + "script src='https://unpkg.com/d3-let@0.3.2/build/d3-let.js'></script><br />");
        document.write("<" + "script src='https://unpkg.com/d3-view@0.9.3/build/d3-view.js'></script><br />");
        document.write("<" + "script src='./assets/js/d3/modal.js?t=" + this.randV + "'></script><br />");
        document.write("<" + "script src='./assets/js/d3/sankey.js?t=" + this.randV + "'></script>");

    document.write("</body>");
  }
};
