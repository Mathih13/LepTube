// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var Tools = require('./tools');
var ipcRenderer = require('electron').ipcRenderer;

var renderedOneTimeElements = false;

document.addEventListener('DOMContentLoaded', () => {

  renderButtons();
  document.querySelector('#page-manager').style.marginTop = '10em';


}, false);


function renderButtons(){
  if(!renderedOneTimeElements)
  {
    createTopBar();
    createCloseAppButton();
    createFullScreenButton();
    createSettingsButton();
    renderedOneTimeElements = true;

  }


}

function createTopBar() {
  var dragArea = document.createElement('div');
  dragArea.id = "dragArea";

  var dragVisual = document.createElement('div');
  dragVisual.id = "dragVisual";

  var topBar = document.createElement('div');
  topBar.id = "topBar";



  topBar.appendChild(dragVisual);
  var masthead = document.querySelector('#masthead');
  var firstChild = document.querySelector('#ticker');

  masthead.insertBefore(topBar, firstChild);
  document.body.appendChild(dragArea);
}

function createFullScreenButton() {

  var button = document.createElement('yt-icon-button')
  button.id = 'fullscreen-button';
  button.className = 'style-scope ytd-masthead topButtons';

  var b = button.querySelector('button');

  var icon = document.createElement('yt-icon');
  icon.id = "guide-icon";
  icon.icon = "yt-icons:fullscreen";
  icon.className = "style-scope ytd-masthead";
  b.appendChild(icon);

  b.addEventListener('click', () => ipcRenderer.send('toggle-fullscreen'));

  document.querySelector('#topBar').appendChild(button);
}

function createCloseAppButton() {
  var button = document.createElement('yt-icon-button')
  button.id = 'close-button';
  button.className = 'style-scope ytd-masthead topButtons';

  var b = button.querySelector('button');

  var icon = document.createElement('yt-icon');
  icon.id = "guide-icon";
  icon.icon = "yt-icons:close";
  icon.className = "style-scope ytd-app";
  b.appendChild(icon);

  b.addEventListener('click', () => ipcRenderer.send('close-window'));

  document.querySelector('#topBar').appendChild(button);
}

function createSettingsButton() {
  var button = document.createElement('yt-icon-button')
  button.id = 'settings-button';
  button.className = 'style-scope ytd-masthead topButtons';

  var b = button.querySelector('button');

  var icon = document.createElement('yt-icon');
  icon.id = "guide-icon";
  icon.icon = "yt-icons:more";
  icon.className = "style-scope ytd-app";
  b.appendChild(icon);

  b.addEventListener('click', () => ipcRenderer.send('toggle-settings-window'));

  document.querySelector('#topBar').appendChild(button);
}
