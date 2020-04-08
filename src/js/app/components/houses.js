import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import House from '.././components/house';
import Vertex from '.././components/vertex';

import { getElemDimensions, emToPx, randIntBetween,
    ROOF_TYPES, SNOW_LAYER_HEIGHT, MIN_NUM_ROOF_RAISES,
    HOUSE_TYPES
 } from '.././helpers/drawHouseUtil.js';

import '../../../style/app.css';

class Houses extends React.Component {
    constructor(props) {
        super(props);
  
        let numHouses = 8;
        let houseStyle = getElemDimensions(".house");
        let maxWidth = emToPx(houseStyle.width);
        let height = emToPx(randIntBetween(7, 8));
        let maxContainerHeight = emToPx(houseStyle.height) - emToPx(houseStyle.padding);
        let maxNumSnowLayers = Math.max(Math.floor((maxContainerHeight - height) / SNOW_LAYER_HEIGHT)
            - (ROOF_TYPES.length + MIN_NUM_ROOF_RAISES), 3);
        let maxHeight = maxContainerHeight - (maxNumSnowLayers * SNOW_LAYER_HEIGHT);
  
        let houseProps = [];
        for (let i = 0; i < numHouses; i++) {
            houseProps.push({
                key: i,
                id: "house" + i,
                width: Math.min(emToPx(randIntBetween(8, 10)), maxWidth),
                height: height,
                maxHeight: maxHeight,
                numFloors: randIntBetween(2, 4) * 2,
                maxNumSnowLayers: maxNumSnowLayers,
                addSnowLayerInterval: randIntBetween(4, 8),
                houseType: HOUSE_TYPES[randIntBetween(0, HOUSE_TYPES.length)],
                collapsed: false
            });
        }
  
        this.state = {
            houseCenter: new Vertex(emToPx(houseStyle.width/2), emToPx(houseStyle.height)),
            maxWidth: maxWidth,
            houseProps: houseProps,
            numHouses: numHouses
        };
    }
  
    render() {
        return (
            <div id="GameDisplay">
                <div id="houses">
                    {this.state.houseProps.map((houseProp, index) => (
                        <House
                            key={index}
                            keyNum={index}
                            id={houseProp.id}
                            center={this.state.houseCenter}
                            width={houseProp.width}
                            height={houseProp.height}
                            maxHeight={houseProp.maxHeight}
                            numFloors={houseProp.numFloors}
                            maxNumSnowLayers={houseProp.maxNumSnowLayers}
                            addSnowLayerInterval={houseProp.addSnowLayerInterval}
                            collapsed={houseProp.collapsed}
                            houseType={houseProp.houseType}
                            onClick={this.props.setActiveHouse.bind(this)}
                            activeHouseId={this.props.activeHouseId}
                            setScore={this.props.setScore}
                            gameScore={this.props.gameScore}
                            volumeIsMuted={this.props.volumeIsMuted}
                            gameDifficulty={this.props.gameDifficulty}
                            gameIsPaused={this.props.gameIsPaused}
                            gameIsReady={this.props.gameIsReady}
                            decreaseLives={this.props.decreaseLives}
                        />
                    ))}
                </div>
            </div>
        );
    }
  }
  
export default Houses;
  