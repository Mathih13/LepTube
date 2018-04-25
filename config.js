'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		darkMode: false,
		lastWindowState: {
      width: 750,
      height: 400,
    },
    fullscreen: false,
	}
});
