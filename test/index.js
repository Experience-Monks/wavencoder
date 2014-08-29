var recordmic = require( 'recordmic' );

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

					//this saving a file is from Recording.js
					var url = (window.URL || window.webkitURL).createObjectURL(data);
					var link = window.document.createElement('a');
					link.href = url;
					link.download = 'output.wav';
					var click = document.createEvent("Event");
					click.initEvent("click", true, true);
					link.dispatchEvent(click);
				});

			}, 3000 );
		}
	});
} else {

	throw new Error( 'not avaiable' );
}