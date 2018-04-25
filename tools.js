var shell = require('electron').shell;

var Tools = function() {};

Tools.prototype.clickElementWithId = function(id) {
  document.querySelector('#' + id).click();
};

Tools.prototype.insertAfter = function(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
};

Tools.prototype.openLink = function(url) {
  shell.openExternal(url);
}



module.exports = new Tools();