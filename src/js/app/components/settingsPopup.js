import React from 'react';
import PropTypes from 'prop-types';
import soundfile from '../audio/piano.wav';

// import './../../style/app.css';

class SettingsPopup extends React.Component {  
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		volumeIsMuted: this.props.isMuted
	// 	}
	// }

	render() {  
		var volumeStatus = "On"
		var muteBtnStyle = "none";
		var unmuteBtnStyle = "block";
		console.log(this.props.isMuted);
		if (this.props.isMuted) {
			volumeStatus = "Off";
			muteBtnStyle = "block";
			unmuteBtnStyle = "none";
		}

		var easyOpacity = 0.5
		var mediumOpacity = 0.5
		var hardOpacity = 0.5
		if (this.props.gameDifficulty === "easy") {
            easyOpacity = 1;
        }
        else if (this.props.gameDifficulty === "medium") {
            mediumOpacity = 1;
        }
        else if (this.props.gameDifficulty === "hard") {
            hardOpacity = 1;
		}
		
		return (  
			<div id='settings-popup'>  

				<div className='settings-popup-content'>
					<div id="settings-popup-close"><img id="settings-popup-close-button" src="./assets/exit.svg" onClick={this.props.closePopup} /></div>
					<h1>Settings</h1>

					<div id="volume-setting">
						<h3>Sound</h3>


						<div>
							<div id="mute-unmute-button">
								<img id="unmute-button" alt="unmute" src="./assets/volumeOn.svg" style={{display: unmuteBtnStyle}} onClick={this.props.toggleMute} />
								<img id="mute-button" alt="mute" src="./assets/volumeOff.svg" style={{display: muteBtnStyle}} onClick={this.props.toggleMute} />
								<p>{volumeStatus}</p>
							</div>
						</div>
					</div>	

					<div id="difficulty-setting">
						<h3>Game Difficulty</h3>
						<div>
							<div id="easy-setting">
								<img id="easy-button" alt="easy" src="./assets/baby-acorn.svg" style={{opacity: easyOpacity}} onClick={this.props.toggleDifficulty.bind(this, "easy")} />
								<p>Easy</p>
							</div>
							<div id="medium-setting">
								<img id="medium-button" alt="medium" src="./assets/teen-squirrel.svg" style={{opacity: mediumOpacity}} onClick={this.props.toggleDifficulty.bind(this, "medium")} />
								<p>Medium</p>
							</div>
							<div id="hard-setting">
								<img id="hard-button" alt="hard" src="./assets/adult-squirrel.svg" style={{opacity: hardOpacity}} onClick={this.props.toggleDifficulty.bind(this, "hard")} />
								<p>Hard</p>
							</div>
						</div>
					</div>			
				</div>  
			</div>  
		);
	}  
}  

export default SettingsPopup;