function Logger(){
  this._logger = require('electron-log');
  this._logger.transports.console.level = false;
}

Logger.prototype={
  addLog: function(textObj){
    this._logger.log(textObj);
  }
};
