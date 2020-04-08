import React from 'react';
import PropTypes from 'prop-types';

import { makeClassStr } from '.././helpers/drawHouseUtil.js';


class Pentagon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: this.props.classes
        }

        this.makePathStr = this.makePathStr.bind(this);
    }

    makePathStr() {
        let pathStr = "M" + this.props.vertices[0].x + " " + this.props.vertices[0].y;
        for (let i=1; i < this.props.vertices.length; i++) {
            pathStr += " L" + this.props.vertices[i].x + " " + this.props.vertices[i].y;
        }
        pathStr += " Z";
        return pathStr;
    }

    componentDidUpdate(prevProps) {
        if (this.props.classes !== prevProps.classes) {
            this.setState(state => ({
                classes: this.props.classes
            }))
        }
    }

    render() {
        return (
            <svg className={makeClassStr(this.state.classes)}>
                <path d={this.makePathStr()} />
            </svg>
        );
    }
}

export default Pentagon;