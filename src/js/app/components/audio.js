import React from 'react';
import PropTypes from 'prop-types';
import soundfile from '../audio/piano.wav';

class bgm extends React.Component {  
	render() {  
		return (  
            <div id='softMusic'>  
                <audio controls loop id="softSettings">
                    <source src={soundfile} type="audio/wav"></source>
                    Your browser does not support the audio element.
                </audio>
            </div>  
        )
	}  
}  


export default bgm;