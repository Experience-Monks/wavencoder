var recordmic = require( 'recordmic' ),
	browsersavefile = require( 'browsersavefile' );

var wavencoder = require( '../index' )( {

	noWorker: true
});

wavencoder.init();


if( recordmic.isAvailable ) {

	var recorder = recordmic( { onSampleData: function( left, right ) {

		// console.log( left );
	}}, function( error ) {

		console.log( 'we\'re good', error );

		if( !error ) {
			recorder.start();

			setTimeout( function() {

				recorder.stop();

				wavencoder.setInterleaved( recorder.getStereoData() );

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