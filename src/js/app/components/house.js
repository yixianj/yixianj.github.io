import React from 'react';
import PropTypes from 'prop-types';

import Vertex from './vertex.js';
import Pentagon from './pentagon.js';
import Decoration from './decoration.js';
import { Line } from 'rc-progress';

import { ROOF_ANGLE_INCREASE_UNIT, SNOW_LAYER_HEIGHT, ROOF_TYPES, COLLAPSING_IMAGES, VOLUME_IS_MUTED, emToPx } from '.././helpers/drawHouseUtil.js';

class House extends React.Component {
    constructor(props) {
        super(props);

        let baseHeight = this.props.height * ((this.props.numFloors - 1) / this.props.numFloors);

        let houseVertices = [
            new Vertex(this.props.center.x - this.props.width / 2, this.props.center.y),
            new Vertex(this.props.center.x - this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x, this.props.center.y - this.props.height),
            new Vertex(this.props.center.x + this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x + this.props.width / 2, this.props.center.y)
        ];

        let snowVertices = [
            new Vertex(this.props.center.x - this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x - this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x, this.props.center.y - this.props.height),
            new Vertex(this.props.center.x + this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x + this.props.width / 2,
                this.props.center.y - baseHeight)
        ];

        let roofVertices = [
            new Vertex(this.props.center.x - this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x - this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x, this.props.center.y - this.props.height),
            new Vertex(this.props.center.x + this.props.width / 2,
                this.props.center.y - baseHeight),
            new Vertex(this.props.center.x + this.props.width / 2,
                this.props.center.y - baseHeight)
        ];

        let styleSheet = window.document.styleSheets[1];
        this.buildBaseCost = 100;
        this.raiseBaseCost = 50;

        this.state = {
            styleRules: styleSheet.cssRules || styleSheet.rules,
            houseVertices: houseVertices,
            snowVertices: snowVertices,
            roofVertices: roofVertices,
            baseHeight: baseHeight,
            width: this.props.width,
            height: this.props.height,
            maxHeight: this.props.maxHeight,
            numSnowLayers: 0,
            maxNumSnowLayers: this.props.maxNumSnowLayers,
            houseType: this.props.houseType,
            houseCondition: "standing",
            nearCollapse: false,
            collapsingImage: COLLAPSING_IMAGES[0],
            classes: ["house"],
            shovelPoints: 0,
            buildCost: 100,
            raiseCost: 50,
            numTimesRaise: 0,
            healthPercent: 0,
            healthColor: "#6BFF33",
            showHealth: true,
            roofType: ROOF_TYPES[0]
        }

        this.collapseAudio = new Audio("./assets/Building_Collapse.wav");
        this.increaseAngle = this.increaseAngle.bind(this);
        this.addSnowLayer = this.addSnowLayer.bind(this);
        this.removeSnowLayer = this.removeSnowLayer.bind(this);
        this.canIncreaseAngle = this.canIncreaseAngle.bind(this);
        this.numSnowLayersToCollapse = this.numSnowLayersToCollapse.bind(this);
        this.canStrengthenRoof = this.canStrengthenRoof.bind(this);
        this.strengthenRoof = this.strengthenRoof.bind(this);
        this.collapseHouse = this.collapseHouse.bind(this);

        this.onClickShovel = this.onClickShovel.bind(this);
        this.onClickBuild = this.onClickBuild.bind(this);
        this.onClickRaise = this.onClickRaise.bind(this);

        this.shovelAudio = new Audio("./assets/shoveling.mp3");
        this.buildAudio = new Audio("./assets/hammering2.wav");
        this.raiseAudio = new Audio("./assets/hammering.wav");

        this.snowTime = 1000;
        this.gameIsReady = false;
        this.gameDifficulty = this.props.gameDifficulty;
        this.gameIsPaused = this.props.gameIsPaused;
    }

    // Return true/false for whether 'raise' can be used again.
    // Suggestion: Use for greying out button for 'raise' when not usable.
    canIncreaseAngle() {
        console.log("height " + this.state.height);
        console.log("ROOF ANGLE INCREASE UNIT " + ROOF_ANGLE_INCREASE_UNIT);
        console.log("maxHeight " + this.state.maxHeight);


        return ((this.state.height + ROOF_ANGLE_INCREASE_UNIT) < this.state.maxHeight);
    }

    // Increases the angle of the roof AKA makes it steeper,
    // by making the whole house's tip taller.
    // Suggestion: Use for 'raise' functionality.
    increaseAngle() {
        console.log("increaseAngle()" + this.canIncreaseAngle());
        if (this.canIncreaseAngle()) {
            console.log(this.props.id + " INCREASING ANGLE");
            // Increase height
            // Move drawn points upward
            this.state.houseVertices[2].move("up", ROOF_ANGLE_INCREASE_UNIT);
            this.state.roofVertices[2].move("up", ROOF_ANGLE_INCREASE_UNIT);
            this.state.snowVertices[2].move("up", ROOF_ANGLE_INCREASE_UNIT);
            // Call setState to force re-render
            this.setState(state => ({ 
                vertices: state.vertices,
                height: state.height + ROOF_ANGLE_INCREASE_UNIT,
                addSnowLayerInterval: 1.1 * state.addSnowInterval
             }));
        }
    }

    // Adds a layer of snow only if it will not collapse.
    addSnowLayer() {
        //console.log("numLayers to Collapse: " + this.numSnowLayersToCollapse())
        //console.log("Current Snow: " + this.state.numSnowLayers)
        let numSnowLayersToCollapse = this.numSnowLayersToCollapse();
        if (numSnowLayersToCollapse > 0 && !this.state.collapsed) {
            // Increase number of snow layers currently on house
            // Move drawn points upward
            if (numSnowLayersToCollapse < 2) {
                this.setState(state => ({
                    nearCollapse: true
                }));
            }

            this.state.snowVertices[1].move("up", SNOW_LAYER_HEIGHT);
            this.state.snowVertices[2].move("up", SNOW_LAYER_HEIGHT);
            this.state.snowVertices[3].move("up", SNOW_LAYER_HEIGHT);
            // Call setState to force re-render
            this.setState(state => ({
                vertices: state.vertices,
                numSnowLayers: state.numSnowLayers + 1,
                shovelPoints: (this.state.numSnowLayers + 1) * 10,
                healthPercent: ((state.numSnowLayers + 1) / state.maxNumSnowLayers) * 100
            }));
    
            if (this.state.healthPercent >= 75) {
                this.setState({ healthColor: "#FF5733" })
            }
            else if (this.state.healthPercent >= 50) {
                this.setState({ healthColor: "#FCFF33" })
            }
        }
        else if (numSnowLayersToCollapse === 0 && this.state.houseCondition !== "collapsed") {
            this.collapseHouse();
        }
    }

    removeSnowLayer() {
        this.state.snowVertices[1].move("down", SNOW_LAYER_HEIGHT);
        this.state.snowVertices[2].move("down", SNOW_LAYER_HEIGHT);
        this.state.snowVertices[3].move("down", SNOW_LAYER_HEIGHT);

        // Call setState to force re-render
        this.setState(state => ({ 
            vertices: state.vertices,
            numSnowLayers: state.numSnowLayers - 1,
            shovelPoints: (state.numSnowLayers - 1) * 10,
            healthPercent: ((state.numSnowLayers - 1) / state.maxNumSnowLayers) * 100,
            houseCondition: ((state.numSnowLayers - 1) < state.maxNumSnowLayers) ? "standing" : "collapsing",
            nearCollapse: ((state.numSnowLayers - 1) < state.maxNumSnowLayers - 1) ? false : true
        }));

        if (this.state.healthPercent >= 75) {
            this.setState({ healthColor: "#FF5733" })
        }
        else if (this.state.healthPercent >= 50) {
            this.setState({ healthColor: "#FCFF33" })
        }
        else {
            this.setState({ healthColor: "#6BFF33" })
        }
    }

    // Returns number of snow layers that can be added
    // before the house should collapse.
    // Suggestion: Use for health bar.
    numSnowLayersToCollapse() {
        //console.log("numSnowLayersToCollapse:: maxNumSnowLayers = " + this.state.maxNumSnowLayers);
        //console.log("numSnowLayersToCollapse:: numSnowLayers = " + this.state.maxNumSnowLayers);
        return Math.max(0, this.state.maxNumSnowLayers - this.state.numSnowLayers);
    }

    collapseHouse() {

        if (this.state.houseCondition !== "collapsed") {
            
            if (!this.props.volumeIsMuted) {
                this.collapseAudio.play();
            }
            
            //console.log("HOUSE COLLAPSING", this.props.id);

            this.setState(state => ({
                houseCondition: (state.collapsingImage.index + 1 < COLLAPSING_IMAGES.length) ? "collapsing" : "collapsed",
                collapsingImage: (state.collapsingImage.index + 1 < COLLAPSING_IMAGES.length) ? COLLAPSING_IMAGES[state.collapsingImage.index + 1] : state.collapsingImage,
                showHealth: false
            }))

            setTimeout(this.collapseHouse, 1000);
        }
        else {
            console.log(this.props.id + " is collapsed.");
            this.props.decreaseLives();
        }
    }

    canStrengthenRoof() {
        return (this.state.roofType.strength < ROOF_TYPES.length - 1);
    }

    // Increases roof strength until it is the strongest possible roof type.
    strengthenRoof() {
        if (this.canStrengthenRoof()) {
            this.setState(state => ({
                roofType: ROOF_TYPES[this.state.roofType.strength + 1],
                maxNumSnowLayers: state.maxNumSnowLayers + 1,
                houseCondition: ((state.numSnowLayers < (state.maxNumSnowLayers + 1)) ? "standing" : "collapsing"),
                nearCollapse: (state.numSnowLayers < (state.maxNumSnowLayers)) ? false : true
            }));
        }
    }
    

    // Shovels snow off roof. Points earned is equivalent to number of layers * 10
    onClickShovel() {
        console.log(this.state.numSnowLayers);
        if (this.state.numSnowLayers > 0 && !this.gameIsPaused) {
            console.log("Shovel house", this.props.id);

            if (!this.props.volumeIsMuted) {
                this.shovelAudio.play();
            }
            this.removeSnowLayer();
            this.props.setScore(parseInt(this.state.shovelPoints));
        }
    }

    // Builds the roof. Points cost is equivalent to base cost * number of times used
    // TODO: Increase max load for house?
    onClickBuild() {
        if (this.props.gameScore >= this.state.buildCost && this.canStrengthenRoof() && !this.gameIsPaused) {
            console.log("Build house", this.props.id);

            if (!this.props.volumeIsMuted) {
                this.buildAudio.play();
            }
            this.strengthenRoof();
            this.props.setScore(parseInt(-(this.state.buildCost)));

            this.setState({
                buildCost: this.buildBaseCost * (this.state.roofType.strength + 2)
            })
        }
    }

    // Raises the roof. Points cost is equivalent to base cost * number of times used
    // TODO: Slow down interval rate for house maybe?
    onClickRaise() {
        if (this.props.gameScore >= this.state.raiseCost && this.canIncreaseAngle() && !this.gameIsPaused) {
            console.log("Raise house", this.props.id);

            if (!this.props.volumeIsMuted) {
                this.raiseAudio.play();
            }
            this.increaseAngle();
            this.props.setScore(parseInt(-(this.state.raiseCost)));

            this.setState({
                numTimesRaise: this.state.numTimesRaise + 1,
                raiseCost: this.raiseBaseCost * (this.state.numTimesRaise + 2)
            })
        }
    }

    render() {
        // Only start interval once splash screen and intro finish
        // if (!this.gameIsReady && this.gameIsReady != this.props.gameIsReady) {
        //     this.gameIsReady = this.props.gameIsReady;
        //     this.addSnowInterval = setInterval(this.addSnowLayer, this.props.addSnowLayerInterval * this.snowTime);
        // }

        // Set game difficulty (interval time)
        if (this.gameDifficulty != this.props.gameDifficulty) {
            this.gameDifficulty = this.props.gameDifficulty;
            clearInterval(this.addSnowInterval);

            if (this.gameDifficulty === "easy") {
                this.snowTime = 1500;
            } 
            else if (this.gameDifficulty === "medium") {
                this.snowTime = 1000;
            }
            else if (this.gameDifficulty === "hard") {
                this.snowTime = 700;
            }

            if (!this.gameIsPaused) {
                this.addSnowInterval = setInterval(this.addSnowLayer, this.props.addSnowLayerInterval * this.snowTime);
            }
        }
        
        // Play or pause game
        if (!this.gameIsPaused && this.gameIsPaused != this.props.gameIsPaused) {
            console.log("Stop");
            this.gameIsPaused = this.props.gameIsPaused;
            clearInterval(this.addSnowInterval);
        }
        
        if (this.gameIsPaused && this.gameIsPaused != this.props.gameIsPaused) {
            console.log("Play");
            this.gameIsPaused = this.props.gameIsPaused;
            this.addSnowInterval = setInterval(this.addSnowLayer, this.props.addSnowLayerInterval * this.snowTime);
        }

        // Set shovel, build, raise icon location and style
        var yShovel = this.props.height + 100;
        var xShovel = this.props.center.x - 110;
        var shovelBtnOpacity = 1;
        if (this.state.numSnowLayers <= 0) {
            shovelBtnOpacity = 0.5;
        }

        var yBuild = this.props.height + 145;
        var xBuild = this.props.center.x - 40;
        var buildBtnOpacity = 1;
        if (this.state.buildCost > this.props.gameScore) {
            buildBtnOpacity = 0.5;
        }

        var yRaise = this.props.height + 100;
        var xRaise = this.props.center.x + 32;
        var raiseBtnOpacity = 1;
        if (this.state.raiseCost > this.props.gameScore) {
            raiseBtnOpacity = 0.5;
        }

        let menu = this.props.activeHouseId === this.props.id ?
            <div id='user-actions'>  
                <div className='shovel'>
                    <div id="shovel" style={{bottom: yShovel + "px", left: xShovel + "px", opacity: shovelBtnOpacity}}>
                        <img id="shovel-button" src="./assets/Shovel_Prototype.png" onClick={this.onClickShovel}/>
                        <p id="shovel-pts">+{this.state.shovelPoints}</p>
                    </div>		
                </div>
                <div className='build'>
                    <div id="build" style={{bottom: yBuild + "px", left: xBuild + "px", opacity: buildBtnOpacity}}>
                        <img id="build-button" src="./assets/Build_Prototype.png" onClick={this.onClickBuild} />
                        <p id="build-pts">-{this.state.buildCost}</p>
                    </div>		
                </div>
                <div className='raise'>
                    <div id="raise" style={{bottom: yRaise + "px", left: xRaise + "px", opacity: raiseBtnOpacity}}>
                        <img id="raise-button" src="./assets/Raise_Prototype.png" onClick={this.onClickRaise}/>
                        <p id="raise-pts">-{this.state.raiseCost}</p>
                    </div>		
                </div>
            </div> 
        : null;

        if (this.state.houseCondition !== "standing") {
            let collapsedHouse = <img id={"collapse" + this.props.keyNum} alt="collapsing"
                src={this.state.collapsingImage.src} 
                style={{width: this.state.collapsingImage.width, height: 'auto', bottom: 0 }} />;
            
            return (
                <div className="house" id={this.props.id} onClick={this.props.onClick.bind(this, this.props)}>
                    { collapsedHouse }
                    { this.state.houseCondition === "collapsed" ? "" : menu } 
                </div>   
            );
        }
        else {
            let exclamationPoint = <img id={"exclamation" + this.props.keyNum} className="exclamationPoint" alt="excalamtion point" src="./assets/Ex_Point.png" 
            style={{width: emToPx(3), height: "auto", bottom: 0}} />;
            return (
                <div className="house" id={this.props.id} onClick={this.props.onClick.bind(this, this.props)}>
                    {this.state.nearCollapse ? exclamationPoint: ""}
                    <Decoration id={"decoration" + this.props.keyNum}
                        width={this.props.width} height={this.state.baseHeight}
                        decorationWidth={this.state.houseType.imageWidth}
                        decorationHeight={this.state.houseType.imageHeight}
                        images={this.state.houseType.images}
                        />
                    <Pentagon vertices={this.state.houseVertices} classes={this.state.houseType.classes}/>
                    <Pentagon vertices={this.state.roofVertices} classes={["roof", this.state.roofType.name]}/>
                    <Pentagon vertices={this.state.snowVertices} classes={["snow"]}/>
                    {this.state.showHealth ?
                        <div id="health-bar"> 
                            <Line percent={this.state.healthPercent} strokeWidth="4" strokeColor={this.state.healthColor} trailWidth="4" />
                        </div>
                    : null }
                    { menu } 
                </div>
            );
        }
    }
}

House.propTypes = {
    width: PropTypes.number.isRequired
}

export default House;
