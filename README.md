# wavencoder

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This module will take sampled data and encode it as a wav file. This is based on https://github.com/mattdiamond/Recorderjs/

This module will use webworkers if they are available with no extra setup.

## Usage

[![NPM](https://nodei.co/npm/wavencoder.png)](https://www.npmjs.com/package/wavencoder)

The following example uses `wavencoder` and two other modules to record 3 seconds of audio from a users mic encode the recorded data as a wav file and allow the user to download it. (It should be noted that in Chrome you must run this code on https as `getUserMedia` is only available on https)

```javascript
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
```

## License

MIT, see [LICENSE.md](http://github.com/mikkoh/wavencoder/blob/master/LICENSE.md) for details.
