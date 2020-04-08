import React from 'react';
import PropTypes from 'prop-types';

class HelpPopup extends React.Component {  

	constructor(props) {
		super(props);

		this.state = {
			numPages: 8,
			pageNum: 0,
			firstTime: true
		}

		this.nextHelpPage = this.nextHelpPage.bind(this);
		this.prevHelpPage = this.prevHelpPage.bind(this);
	}

	nextHelpPage() {
		this.setState(state => ({
			pageNum: state.pageNum + 1
		}));
	}

	prevHelpPage() {
		this.setState(state => ({
			pageNum: state.pageNum - 1
		}));
	}

	render() {
		let instructions = "";
		let header = "";
		switch(this.state.pageNum) {
			case 0:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<figure style={{border: "solid #0cf23e 0.2em"}}><img id="play_pause_help" alt="play" src="./assets/play-cute.svg" /><figcaption>
							Click to play game.</figcaption></figure>
						<figure><img id="play_pause_help" alt="info" src="./assets/pause-cute.svg"/><figcaption>
							Click to pause game.</figcaption></figure>
						<figure><img id="settings_help" alt="gear" src="./assets/settings-cute.svg"/><figcaption>
							Click to toggle music/sound and to select difficult.</figcaption></figure>
						<figure><img id="info_help" alt="info" src="./assets/help-cute.svg"/><figcaption>
							Click to review these instructions again.</figcaption></figure>
						<p>
							Snow will continuously build up on the roofs. If the snow builds up too high, the entire house will collapse.
							After three houses have collapsed, it's game over. Fortunately, the user has three abilities they can use by clicking on each house. These are the Shovel, Build,
							and Raise actions. Click through to learn about these abilities.
						</p>
					</div>
				);
				header = "How to Play";
				break;
			case 1:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id="help_images">
							<figure><img id="shovel_house_help" src="./assets/Shovel_House_Example.png" /><figcaption>
								Snow will build up on houses in layers. Users can visually assess how much snow is on
								each house by looking at the height of the snow. The higher the snow level, the more points
								the user can gain by shoveling. </figcaption></figure>
							<figure><img id="shovel_button_help" src="./assets/Shovel_Button_Example.png" /><figcaption>
								To clear the snow, the user clicks on the house they want to remove snow from, and then clicks
								the "shovel" button. The user gains points/money proportional to the height of the layer cleared.
								This number is shown at the bottom of the "shovel" button. This is the only way the user can 
								gain points/money and can be performed repeatedly for every house.</figcaption></figure>
						</div>
					</div>
				);
				header = "Build";
				break;
			case 2:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id = "help_images">
							<figure><img id="build_button_help" src="./assets/Build_Button_Example.png" /><figcaption>
								In order to increase the total amount of snow a house can hold at a single time, the
								user can select the "build" action when clicking a house. The number below the button
								represents the cost of building the roof. This cost increases by increments of 100 
								per each upgrade per house.</figcaption></figure>
							<figure><img id="build_house_help" src="./assets/Build_House_Example.png" /><figcaption>
								The "build" action's result is indicated by a change in the color of the house's roof. The house
								can now hold a higher number of layers of snow before collapsing. Each house's roof can be built 
								up a maximum of 3 times.</figcaption></figure>
						</div>
					</div>
				);
				header = "Shovel";
				break;
			case 3:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id = "help_images">
							<figure><img id="raise_button_help" src="./assets/Raise_Button_Example.png" /><figcaption>
								In order to decrease the rate at which snow builds on a house's roof, the user can select
								the "raise" action when clicking a house. The number below the button represents the cost
								of raising the roof. This cost increases by increments of 50 per each upgrade per house.</figcaption></figure>
							<figure><img id="raise_house_help" src="./assets/Raise_House_Example.png" /><figcaption>
								The "raise" action's result is indicated by an increase in the slope/height of the house's roof.
								Snow will now accumulate slower on that specific house. Each house's roof can be raised a maximum
								of 7 times.</figcaption></figure>
						</div>
					</div>
				);
				header = "Raise";
				break;
			case 4:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id = "help_images">
							<figure><img id="collapse_warning_help" src="./assets/Warning_Collapse_Example.png" /><figcaption>
								When a house is one layer of snow away from collapsing, a red exclamation point will appear
								above it. This indication means the user has to shovel snow off the roof before the final layer
								of snow builds up.</figcaption></figure>
							<figure><img id="health_help" src="./assets/Health_Bar_Example.png" /><figcaption>
								Luckily, the user can monitor the health of all the houses through health bars at the
								bottom of each house. The health bar will update from green (not in danger) to yellow 
								(several layers of snow) to red (getting close to collapse). </figcaption></figure>
						</div>
					</div>
				);
				header = "Health";
				break;
			case 5:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id="help_images">
							<figure><img id="collapsed_house_help" src="./assets/Collapsed_House_Example.png" /><figcaption>
								If a user is unable to shovel snow off a house in time, the house will start to collapse.
								Once the house starts to collapse, it is not possible to save it. The user can no longer 
								interact with the house.</figcaption></figure>
							<figure><img id="lost_life_help" src="./assets/Lost_Life_Example.png" /><figcaption>
								Lives are indicated by acorns at the top right of the screen. For each house that collapses,
							the user loses one acorn. Once they have lost all three acorns, it is game over.</figcaption></figure>
						</div>
					</div>
				);
				header = "Collapse";
				break;
			case 6:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<p>There are lots of houses. Swipe or scroll to the side!</p>
					</div>
				);
				header = "Swipe or Scroll";
				break;
			case 7:
				instructions = (
					<div className="instructions" id={"instructions" + this.state.pageNum}>
						<div id="instructions-buttons">
                            <img id="help-popup-play-button" alt="play" src="./assets/play-cute.svg" onClick={this.props.togglePlayGame} />
							<img id="help-popup-pause-button" alt="pause" src="./assets/pause-cute.svg" onClick={this.props.togglePlayGame} />
						</div>
					</div>
				);
				header = "Start Playing";
				break;
			default:
				break;
		}

		return (
			<div id='help-popup'>  
				<div className='help-popup-content'>
					<div id="help-popup-header">
						{this.state.pageNum > 0 ? <div id="help-popup-prev-arrow"><img id="help-popup-prev-arrow-button" src="./assets/prev-arrow.svg" onClick={this.prevHelpPage} /></div>:""}
						{(this.state.pageNum < this.state.numPages-1) ?<div id="help-popup-next-arrow"><img id="help-popup-next-arrow-button" src="./assets/next-arrow.svg" onClick={this.nextHelpPage} /></div> : ""}
						<div id="help-popup-close"><img id="help-popup-close-button" src="./assets/exit.svg" onClick={this.props.closePopup} /></div>
						<h1>{ header }</h1>
					</div>
					{ instructions }
				</div>  
			</div>  
		);
	}  
}  

export default HelpPopup;