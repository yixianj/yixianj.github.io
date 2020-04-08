import React from 'react';
import PropTypes from 'prop-types';

import { range, COL_NUM_BUFFER, ROW_NUM_BUFFER } from '.././helpers/drawHouseUtil.js';

class Decoration extends React.Component {
    constructor(props) {
        super(props);

        let styleSheet = window.document.styleSheets[1];

        // Adjust decoration div width to
        // house's width and base height
        styleSheet.insertRule('[id="' + this.props.id
            + '"] {width:' + this.props.width
            + 'px; height:' + this.props.height + 'px;}',
            styleSheet.rules.length);
        // Adjust decoration images to given width and height
        styleSheet.insertRule('#' + this.props.id
            + ' .row > img {width:' + this.props.decorationWidth
            + 'px; height:' + this.props.decorationHeight + 'px;}',
            styleSheet.rules.length);
        
        // Calculate number of possible rows and columns
        this.state = {
            id: this.props.id,
            styleSheet: styleSheet,
            images: this.props.images,
            numCols: range(0, Math.floor(this.props.width
                /this.props.decorationWidth) - COL_NUM_BUFFER, 1),
            numRows: range(0, Math.floor(this.props.height
                /this.props.decorationHeight) - ROW_NUM_BUFFER, 1)
        }
    }

    render() {
        return (
            <div className="decoration" id={this.props.id}>
                {this.state.numRows.map((rowNum, rowIndex) => (
                    <div key={rowIndex} className="row" id="house-window-row">
                    {rowNum < this.state.numRows.length - 2
                    ? this.state.numCols.map((colNum, index) => (
                        <img key={index} className="window" id={"window-" + this.state.id} alt="window" src={this.state.images.bottomWindow} />
                    ))
                    : <img className="door" id={"door-" + this.state.id} alt="door" src={this.state.images.door} />
                    }
                    </div>
                ))
                }
            </div>
        );
    }
}

Decoration.propTypes = {
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

export default Decoration;
