import React from 'react';
import PropTypes from 'prop-types';
import Vertex from './vertex.js';

import { makeClassStr, makePointStr } from './../helpers/drawHouseUtil.js';
import { printVertices } from './../helpers/testingUtil.js';


class Roof extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vertices: this.props.vertices,
            classes: this.props.classes
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.classes !== prevProps.classes) {
            console.log("UPDATING ROOF CLASS");
            this.setState(state => ({
                classes: this.props.classes
            }));
        }
    }

    render() {
        console.log("ROOF VERTICES");
        printVertices(this.state.vertices);
        return (
            <div>
                <svg className={makeClassStr(this.state.classes)}>
                    <polygon className="roof" points={makePointStr(this.state.vertices)}/>
                </svg>
            </div>

        );
    }
}

Roof.propTypes = {
    vertices: PropTypes.array.isRequired,
}

export default Roof;