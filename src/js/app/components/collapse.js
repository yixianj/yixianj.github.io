import React from 'react';
import PropTypes from 'prop-types';

class Collapse extends React.Component {
    constructor(props) {
        super(props);

    }
  

	render() {
        //var houseNum = parseInt(this.props.houseId.slice(this.props.houseId.length - 1));

        var yCloud = this.props.houseCenter; //px
        var xCloud = this.props.houseCenter; //px

		return (  
			<div id='collapse'>  
				<div id="cloud" style={{bottom: yCloud + "px", left: xCloud + "em"}}>
                    <img id="collapse_cloud" src="./assets/House_Collapse_1.png"/>
				</div>
			</div>  
		);
	}  
}  

export default Collapse;