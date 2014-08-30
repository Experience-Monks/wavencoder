var interleaved, sampleRate, channels;


//this will fail if this wasn't browserified
try {

	module.exports = {

		init: init,
		exportWAV: exportWAV,
		setInterleaved: setInterleaved
	};
//otherwise create hooks for webworker
} catch( e ) {

	this.onmessage = function(e){

		switch(e.data.command){
			case 'init':
				init(e.data.config);
				break;
			case 'exportWAV':
				exportWAV(e.data.type);
				break;
			case 'setInterleaved':
				setInterleaved(e.data.interleaved);
				break;
		}
	};
}



function init(config){
	sampleRate = ( config && config.sampleRate ) || 44100;
	channels = ( config && config.channels ) || 2;
}

function exportWAV(type){
	
	var dataview = encodeWAV( interleaved );
	var audioBlob = new Blob([dataview], { type: type });

	if( this.onmessage ) {

		this.postMessage( audioBlob );
	} else {

		return audioBlob;
	}
}

function setInterleaved( data ) {
		
	interleaved = data;
}

function floatTo16BitPCM(output, offset, input){

	for (var i = 0; i < input.length; i++, offset+=2){
		var s = Math.max(-1, Math.min(1, input[i]));
		output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	}
}

function writeString(view, offset, string){
	for (var i = 0; i < string.length; i++){
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

function encodeWAV(samples){
	var buffer = new ArrayBuffer(44 + samples.length * 2);
	var view = new DataView(buffer);

	console.log( sampleRate, samples.length );

	/* RIFF identifier */
	writeString(view, 0, 'RIFF');
	/* file length */
	view.setUint32(4, 32 + samples.length * 2, true);
	/* RIFF type */
	writeString(view, 8, 'WAVE');
	/* format chunk identifier */
	writeString(view, 12, 'fmt ');
	/* format chunk length */
	view.setUint32(16, 16, true);
	/* sample format (raw) */
	view.setUint16(20, 1, true);
	/* channel count */

	view.setUint16(22, channels, true);
	// view.setUint16(22, 2, true);
	
	/* sample rate */
	view.setUint32(24, sampleRate, true);
	/* byte rate (sample rate * block align) */
	view.setUint32(28, sampleRate * 4, true);
	/* block align (channel count * bytes per sample) */
	view.setUint16(32, 4, true);
	/* bits per sample */
	view.setUint16(34, 16, true);
	/* data chunk identifier */
	writeString(view, 36, 'data');
	/* data chunk length */
	view.setUint32(40, samples.length * 2, true);

	floatTo16BitPCM(view, 44, samples);

	return view;
}