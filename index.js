var brfs = require('brfs');
var webWorker = require('web-worker');
var worker = require( './wavWorker' );
var fs = require('fs');
var path = require('path');

var wavencoder = function( settings ) {

	if( !( this instanceof wavencoder ) )
		return new wavencoder( settings );

	settings = settings || {};
	
	this.isUsingWorker = Boolean( window.Worker && !settings.noWorker );

	if( this.isUsingWorker ) {

		console.log('using with string');
		this.worker = new webWorker(fs.readFileSync(path.join(__dirname, 'wavWorker.js'), 'utf8'));
	}
};

wavencoder.prototype = {

	init: function( settings ) {

		if( this.isUsingWorker ) {

			this.worker.postMessage( {

				config: settings,
				command: 'init'
			});
		} else {

			worker.init( settings );
		}
	},

	setInterleaved: function( interleaved ) {

		if( this.isUsingWorker ) {

			this.worker.postMessage( {
				command: 'setInterleaved',
				interleaved: interleaved 
			});
		} else {

			worker.setInterleaved( interleaved );
		}
	},

	exportWAV: function( callback ) {

		if( this.isUsingWorker ) {

			this.worker.onmessage = function( ev ) {

				callback( ev.data );

				this.worker.onmessage = undefined;
			}.bind( this );

			this.worker.postMessage( {

				command: 'exportWAV'
			});
		} else {

			callback( worker.exportWAV() );
		}
	}
};

module.exports = wavencoder;