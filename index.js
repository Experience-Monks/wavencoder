var worker = require( './wavWorker' );

var wavencoder = function( settings ) {

	if( !( this instanceof wavencoder ) )
		return new wavencoder( settings );

	this.isUsingWorker = Boolean( window.Worker && !settings.noWorker );

	if( this.isUsingWorker ) {

		this.worker = new Worker( settings.pathToWorker || 'waveWorker.js' );
	}
};

wavencoder.prototype = {

	init: function( settings ) {

		if( this.isUsingWorker ) {

		} else {

		}
	},

	setInterleaved: function( interleaved ) {

		if( this.isUsingWorker ) {

			this.worker.postMessage( interleaved );
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
		} else {

			callback( worker.exportWAV() );
		}
	}
};

module.exports = wavencoder;