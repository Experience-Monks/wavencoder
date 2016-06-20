var recordmic = require('recordmic');
var browsersavefile = require( 'browsersavefile' );

var wavencoder = require('../index')();

wavencoder.init();


if(recordmic.isAvailable) {

	var recorder = recordmic({ onSampleData: function( left, right ) {

		// console.log( left );
	}}, function( error ) {

		console.log('we\'re good', error);

		if(!error) {
			console.log('start recording');

			recorder.start();

			setTimeout( function() {

				console.log('stop recording');

				recorder.stop();

				wavencoder.setInterleaved(recorder.getStereoData());

				wavencoder.exportWAV( function( data ) {

					console.log( data );

					browsersavefile( 'output.wav', data );
				});

			}, 3000 );
		}
	});
} else {

	throw new Error( 'not avaiable' );
}