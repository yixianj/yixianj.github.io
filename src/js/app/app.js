import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import bgm from './components/audio';
import Houses from './components/houses';
import Player from './components/player';
import SettingsPopup from './components/settingsPopup';
import HelpPopup from './components/helpPopup';
import fightSong from './audio/hail.mp3';
import collapsed from './images/sad.png';
import cryingSquirrel from './images/sadSquirrel.png';
import umichWinter from './images/umichWinter.jpg';
import soundfile from './audio/piano.wav';
import lost from './audio/gameOver.mp3';




import Interaction from './helpers/interaction';
import snowstorm from './helpers/snow';
import { getElemDimensions, emToPx, randIntBetween, ROOF_TYPES, HOUSE_TYPES, SNOW_TYPES, NUM_LIVES, VOLUME_IS_MUTED } from './helpers/drawHouseUtil.js';


import './../../style/app.css';

export default class App extends React.Component {
  constructor(props) {
      super(props);

      this.snowstorm = snowstorm;

      this.state = {
          activeHouse: null,
          activeHouseId: null,
          loading: true,
          showSettingsPopup: false,
          showHelpPopup: true,
          gameIsPaused: true,
          volumeIsMuted: false,
          gameScore: 0,
          gameDifficulty: "medium", // easy, medium, hard
          gameIsReady: false,
          numLives: NUM_LIVES,
          gameOver: false
      };

      this.toggleSettingsPopup = this.toggleSettingsPopup.bind(this);
      this.toggleHelpPopup = this.toggleHelpPopup.bind(this);
      this.togglePlayGame = this.togglePlayGame.bind(this);
      this.setScore = this.setScore.bind(this);
      this.toggleMute = this.toggleMute.bind(this);
      this.toggleDifficulty = this.toggleDifficulty.bind(this);
      this.decreaseLives = this.decreaseLives.bind(this);
      this.gameOverTrigger = this.gameOverTrigger.bind(this);
      this.exit = this.exit.bind(this);
      this.scrollingHail = new Audio(fightSong);
      this.gameSoft = new Audio(soundfile);
      this.loserAudio = new Audio(lost);

  }

  componentDidMount() {
      window.addEventListener('click', this.handleDocumentClick)
  }

  toggleSettingsPopup() {
    this.setState({  
        showSettingsPopup: !this.state.showSettingsPopup  
    });  
  }

  toggleHelpPopup() {
    this.setState({  
        showHelpPopup: !this.state.showHelpPopup  
    });  
  }

  toggleAudio() {
    this.setState({  
        showHelpPopup: !this.state.showHelpPopup  
    });  
  }

  togglePlayGame() {
      if (this.state.gameIsPaused) {
        // Start game

        // Set correct icon
        document.getElementById('play-button').style.display = 'none';
        if (document.getElementById('help-popup-play-button')) {
            document.getElementById('help-popup-play-button').style.display = 'none';
        }
        document.getElementById('pause-button').style.display = 'block';
        if (document.getElementById('help-popup-pause-button')) {
            document.getElementById('help-popup-pause-button').style.display = 'block';
        }
      }
      else {
        // Pause game

        // Set correct icon
        document.getElementById('play-button').style.display = 'block';
        if (document.getElementById('help-popup-play-button')) {
            document.getElementById('help-popup-play-button').style.display = 'block';
        }
        document.getElementById('pause-button').style.display = 'none'; 
        if (document.getElementById('help-popup-pause-button')) {
            document.getElementById('help-popup-pause-button').style.display = 'none';
        }
      }

      this.setState({  
        gameIsPaused: !this.state.gameIsPaused  
    });  
  }

    setActiveHouse = (e) => {
        var activeHouseProps = e;
        this.setState({  
            activeHouse: activeHouseProps,
            activeHouseId: activeHouseProps.id
        }); 
    }

    setScore(points) {
        console.log(points);
        this.setState(state => ({ 
            gameScore: state.gameScore + points
        }));
    }

    toggleMute() {
        if (this.state.volumeIsMuted) { 
            // Set unmute icon to be visible
            document.getElementById('mute-button').style.display = 'none';
            document.getElementById('unmute-button').style.display = 'block';

            this.gameSoft.currentTime = 0;
            this.gameSoft.play();
        }
        else {    
            // Set mute icon to be visible
            document.getElementById('mute-button').style.display = 'block';
            document.getElementById('unmute-button').style.display = 'none'; 

            this.gameSoft.pause();
        }

        this.setState({  
            volumeIsMuted: !this.state.volumeIsMuted
        });  
    }

    toggleDifficulty = (level) => {
        if (level === "easy") {
            document.getElementById('easy-button').style.opacity = 1;
            document.getElementById('medium-button').style.opacity = 0.5;
            document.getElementById('hard-button').style.opacity = 0.5;
        }
        else if (level === "medium") {
            document.getElementById('easy-button').style.opacity = 0.5;
            document.getElementById('medium-button').style.opacity = 1;
            document.getElementById('hard-button').style.opacity = 0.5;
        }
        else if (level === "hard") {
            document.getElementById('easy-button').style.opacity = 0.5;
            document.getElementById('medium-button').style.opacity = 0.5;
            document.getElementById('hard-button').style.opacity = 1;
        }

        this.setState({  
            gameDifficulty: level
        });  
    }


    handleDocumentClick = (e) => {
        var target = e.target.getAttribute('id');
        var parent = e.target.parentNode.getAttribute('id');

        var isClickOnItem = false;
        var isClickOnHouse = false;
        var isClickParent = false;
        if (target) {
            isClickOnItem = target.startsWith('shovel') || target.startsWith('build') || target.startsWith('raise');
            isClickOnHouse = target.startsWith('house') || target.startsWith('decoration');
        }
        if (parent) {
            isClickParent = parent.startsWith('house') || parent.startsWith('decoration');
        }
        if (!isClickOnHouse && !isClickOnItem && !isClickParent && e.target.nodeName != "path" && e.target.nodeName != "svg") {
            this.setState({
                activeHouse: null
            })
        }
    }



    gameOverTrigger() {
        console.log("GAMEOVERTRIGGER()");

        document.getElementById("gameOverDisplay").style.display = "block";
        document.getElementById("EntireGame").style.display = "none";

        this.gameSoft.pause();

       
        this.loserAudio.currentTime = 0;
        this.loserAudio.play();

        this.setState(state => ({
            volumeIsMuted: true
        }));
    }

    exit() {
        console.log("EXIT CLILCKED");
        this.setState(state => ({
            gameOver: true
        }));
    }


    splashClick() {
        document.getElementById("SplashDisplay").style.display = "none";
        document.getElementById("ScrollingBeginning").style.display = "block";  
        
        this.scrollingHail.currentTime = 0;
        this.scrollingHail.play();

        var stopSoft = document.getElementById("soft");
        stopSoft.pause();

        setTimeout(
            () => {
                document.getElementById("scrollingButton").style.display = "none";
                document.getElementById("scrolingText").style.display = "none";
                //document.getElementById("scrolingText").classList.remove("star-wars");
                document.getElementById("scrollingFinButton").style.display = "block";  
                document.getElementById("blackBackground").style.display = "block";
            },
            60 * 1000
            );
    }

    scrollingClick() {
        document.getElementById("ScrollingBeginning").style.display = "none";  

        this.scrollingHail.pause();


        this.gameSoft.currentTime = 0;
        this.gameSoft.play();


        document.getElementById("ScrollingBeginning").style.display = "none";       
        document.getElementById("EntireGame").style.display = "block";  
        this.setState({
            gameIsReady: true
        })     
    }

    decreaseLives() {
        if ((this.state.numLives - 1) > 0) {
            console.log("LOST LIFE!!!");
            this.setState(state => ({
                numLives: state.numLives - 1
            }));
        }
        else {
            console.log("decreaseLives:: 0 lives. Setting gameover: true");
            this.setState(state => ({
                numLives: 0,
                gameOver: true
            }));
        }
    }

  

    backToBeginning() {/*
        document.getElementById("gameOverDisplay").style.display = "none";
        document.getElementById("SplashDisplay").style.display = "block";

        this.loserAudio.pause();

        var playSoft = document.getElementById("soft");
        playSoft.currentTime = 0;
        playSoft.play();
        */
        window.location.reload();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("COMPONENTDIDUPDATE()");
        console.log(this.state.gameOver);
        if (this.state.gameOver !== prevState.gameOver) {
          this.gameOverTrigger();
        }
      }

  render() {
        
        return (

            <div>

                <div id="SplashDisplay">

                    <br></br>
                    <br></br>

                    <div id="welcomeTo"> Welcome to </div>

                    <br></br>

                    <div id="snowblaster"> Snowbla<sup>2</sup>ster</div>

                    <br></br>
                    <br></br>
                    <br></br>

                    <div className="box">
                        <a href="#" onClick={this.splashClick.bind(this)} className="btn btn-white btn-animation-1">Click to Start</a> 
                    </div>

                    <br></br>

                    <div id="developedBy"> Developed by: Christina Vafaian, Adina Jia, Julia Xu, and Nicholas Riesterer </div>

                    <br></br>

                    <div id="developedBy"> For more information please contact snowblaster@umich.edu </div>
                    <br></br>

                    <div id='softMusic'>  
                        <audio controls autoPlay loop id="soft">
                            <source src={soundfile} type="audio/wav"></source>
                            Your browser does not support the audio element.
                        </audio>
                    </div>  

                    <br></br>

                </div>

                <div id="ScrollingBeginning">

                    <div id="scrolingText">
                        <div className="fade"></div>

                        <section className="star-wars">

                        <div className="crawl">

                            <div className="title">
                            <p>Snowbla<sup>2</sup>ster</p>
                            <h1>Winter in Ann Arbor</h1>
                            </div>
                            
                            <p>It's currently winter in Ann Arbor, a brutal time of the year. With winter comes piles and piles of snow. Luckily people have come up with methods of removing snow by the ton. However, what about the snow that isn't removed? Like on the roof-tops? </p>      
                            <p>After a season of being fed by the friendly folks of Ann Arbor, our dear squirrel friend Russel would like to find a place to rest for the winter. Unlike other squirrels, our Russel enjoys living in the roofs of buildings. It is nice and warm there and is a great place to keep their supply of acorns.</p>
                            <p>In the past few years, Ann Arbor has received more than a few feet of snow when there is snowfall. While people will clean the roads and sidewalks, they tend to forget that there is also snow on the roofs. As snow builds up, this could potentially cause the building to collapse! This is very dangerous for our unsuspecting friend Russel.   </p>
                            <p>Please help clear the roofs of Ann Arbor so our dear Russel can have a restful winter!</p>
                            <p></p>
                            <p>Click Begin to Continue</p>
                        </div>

                        </section>

                    </div>

                    <div id="blackBackground">
                        <a href="#" onClick={this.scrollingClick.bind(this)} id='scrollingFinButton' className="btn btn-white btn-animation-1">Begin</a> 
                    </div>

                    <a href="#" onClick={this.scrollingClick.bind(this)} id="scrollingButton">Skip Intro</a> 

                    <br></br>
                </div>

                <div id="EntireGame">

                    <div id="GameDisplay">
                        <Houses 
                            setActiveHouse={this.setActiveHouse}
                            activeHouseId={this.state.activeHouseId}
                            setScore={this.setScore}
                            gameScore={this.state.gameScore}
                            volumeIsMuted={this.state.volumeIsMuted}
                            gameDifficulty={this.state.gameDifficulty}
                            gameIsPaused={this.state.gameIsPaused}
                            gameIsReady={this.state.gameIsReady}
                            decreaseLives={this.decreaseLives}/>
                    </div>

                    <div id="gameComponents">
                        <div id="settings"><img id="settings-button" alt="gear" src="./assets/settings-cute.svg" onClick={this.toggleSettingsPopup} /></div>
                        <div id="help"><img id="help-button" alt="info" src="./assets/help-cute.svg" onClick={this.toggleHelpPopup} /></div>
                            <div id="quit-button" onClick={this.gameOverTrigger}><h4>Quit</h4></div>
                        <div id="play-pause-button">
                            <img id="play-button" alt="play" src="./assets/play-cute.svg" onClick={this.togglePlayGame} />
                            <img id="pause-button" alt="pause" src="./assets/pause-cute.svg" onClick={this.togglePlayGame} />
                        </div>
                        <div id="squirrel"><img id="squirrel-icon" alt="squirrel" src="./assets/squirrel.svg" /></div>
                        <div id="lives">
                            {(this.state.numLives > 0) ? <img id="life-1" alt="life 1" src="./assets/full-acorn.svg" /> : <img id="dead-1" src="./assets/empty-acorn.svg" />}
                            {(this.state.numLives > 1) ? <img id="life-2" alt="life 2" src="./assets/full-acorn.svg" /> : <img id="dead-2" src="./assets/empty-acorn.svg" />}
                            {(this.state.numLives > 2) ? <img id="life-3" alt="life 3" src="./assets/full-acorn.svg" /> : <img id="dead-3" src="./assets/empty-acorn.svg" />}
                            {/*<img id="life-1" alt="life 1" src="./assets/full-acorn.svg" />
                            <img id="life-2" alt="life 2" src="./assets/full-acorn.svg" />
                            <img id="life-3" alt="life 3" src="./assets/full-acorn.svg" />*/}
                            {/* <img id="dead-1" src="./assets/empty-acorn.svg" />
                            <img id="dead-2" src="./assets/empty-acorn.svg" />
                            <img id="dead-3" src="./assets/empty-acorn.svg" /> */}
                        </div>
                        <div id="score">
                            <img id="score-icon" src="./assets/money.svg" />
                            <span>&nbsp;{this.state.gameScore}</span>
                        </div>

                        <div id='softMusic'>  
                            <audio loop id="softSettings">
                                <source src={soundfile} type="audio/wav"></source>
                                Your browser does not support the audio element.
                            </audio>
                        </div> 
                    </div>

                    {this.state.showSettingsPopup ?  
                        <SettingsPopup  
                            closePopup={this.toggleSettingsPopup}  
                            toggleMute={this.toggleMute}
                            isMuted={this.state.volumeIsMuted}
                            toggleDifficulty={this.toggleDifficulty}
                            gameDifficulty={this.state.gameDifficulty}
                        />  
                    : null  
                    }

                    {this.state.showHelpPopup ?  
                        <HelpPopup  
                            closePopup={this.toggleHelpPopup}
                            togglePlayGame={this.togglePlayGame}
                            gameIsPaused={this.state.gameIsPaused}
                        />  
                    : null  
                    }                 
                </div>

                <div id= "gameOverDisplay">

                    <img id = "umichWinterPic" src={umichWinter} alt="winterBackground"/>

                    <br></br>
                    <br></br>


                    <div className="sign" id ="gameOverText">
                        <span className="fast-flicker">G</span>a<span className="flicker">me</span> O<span className="fast-flicker">v</span>e<span className="flicker">r</span>
                    </div>
              

                    <div id = "gameFinTextBox">
                      <b>Oh no! </b> After a heavy snowstorm, all of Russels potential hibernating spots have collapsed under the weight of all the snow.
                      <br></br>
                      <br></br>

                      Unfortunately, roofs collapsing under the weight of snow is something that can happen in real life too. These situations may occurr because of a multitude of reasons. Among which include: 
                      <br></br>
                      <ul>
                          <li>Poor design</li>
                          <li>Poor construction</li>
                          <li>Lack of maintenance</li>
                          <li>Structures built at a time of lacking code requirements</li>
                          <li>Insulated roofs of older structures that prevent heat from melting snow and thereby contribute to snow load</li>
                      </ul>

                      <br></br>

                      Luckily there are some steps that you can take to prevent your roof from collapsing before a heavy snowstorm like the one in the game. These steps include:
                      <br></br> 
                      <ul>
                          <li>Inspect your roof from the ground</li>
                          <li>Have your roof professionally inspected</li>
                          <li>Check your gutters and downspouts</li>
                          <li>Make sure your attic is properly insulated</li>
                      </ul>

                      <br></br>

                      After a heavy snowstorm, you can help take off some of the snow by using a snow rake. Like the shovel mechanism in the game, a snow rake is used to remove snow/ice from the roofs. This will help the snow/ice melt faster and will help to immediately remove some of the weight of the snow.
                      <br></br>
                      <br></br>

                      To learn more about how snow can impact buildings along with tips and tricks to preventing collapse, these are some resources that you may find useful:
                      <br></br> 
                      <ul>
                          <li><a href="https://www.amfam.com/resources/articles/at-home/prevent-your-roof-from-collapsing-because-of-snow"> Prevent Your Roof From Collapsing</a></li>
                          <li><a href="https://www.summitengineeringinc.com/worried-snow-roof-top-signs-potential-roof-collapse/"> Signs of Roof Collapse</a></li>
                          <li><a href="https://www.accuweather.com/en/weather-news/how-to-prevent-a-roof-collapse-during-a-massive-snowstorm-2/432263"> Impact of Roof Structure on Snow Settling </a></li>
                          <li><a href="https://www.whirlwindsteel.com/blog/bid/264596/designing-a-building-to-withstand-heavy-snow"> Roof Structure and Design</a></li>
                      </ul>

                    </div>
                    <a href="#" onClick={this.backToBeginning.bind(this)} id='returnToBeginning' className="btn btn-white btn-animation-1">Go back to Beginning</a> 

                    <img id = "cryingSquirrelPic" src={cryingSquirrel} alt="CryingSquirrel"/>



                </div>
            </div>
        );
    }
}
