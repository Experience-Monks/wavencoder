var worker = require( './wavWorker' );

var wavencoder = function( settings ) {

	if( !( this instanceof wavencoder ) )
		return new wavencoder( settings );

	this.isUsingWorker = Boolean( window.Worker && !settings.noWorker );

	if( this.isUsingWorker ) {

		this.worker = new Worker( settings.workerPath || 'waveWorker.js' );
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