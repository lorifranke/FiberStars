import React from "react";
import "./splitscreenview.scss";
import Col from 'react-bootstrap/Col';
import Fibers3d from './../fibers3d/Fibers3d';
import Radial from './../radial/Radial';
import StatBox from './../statbox/StatBox';

export default class SplitScreenView extends React.Component {

    componentDidMount = () => {
        this.update();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.update();
    }

    render = function () {
        this.fibers3dComponents = {};
        return (
            this.props.subjects.map((subject, sIndex) => {
                return (
                    this.props.clusters.map((cluster, cIndex) => {
                        return (
                            <Col style={{width: 1 / (this.props.subjects.length * this.props.clusters.length) * 100 + "%"}}
                                 className={"splitScreenViewColumn"}>
                                <Fibers3d
                                    ref={(ref) => {
                                        // keep reference to this component
                                        this.fibers3dComponents["f3d_" + sIndex + "_" + cIndex] = ref
                                    }}
                                    canvasId={"f3d_" + sIndex + "_" + cIndex}
                                    cluster={cluster}
                                    subject={subject}
                                    colorArray={this.props.colorArray}
                                    colorMap={this.props.colorMap}
                                    min={this.props.data[subject][cluster].raw_data.colMinima[this.props.data[subject][cluster].col_names.indexOf(this.props.colorArray)]}
                                    max={this.props.data[subject][cluster].raw_data.colMaxima[this.props.data[subject][cluster].col_names.indexOf(this.props.colorArray)]}
                                />
                                <div class="radial-box">
                                    <Radial
                                        crad={75}
                                        data={this.props.data[subject][cluster]}
                                    />
                                </div>
                                <div className="stat-box">
                                    <StatBox
                                        data={this.props.data[subject][cluster]}
                                        metadata={this.props.metadata[subject]}
                                        subject={subject}
                                        cluster={cluster}
                                    />
                                </div>
                            </Col>
                        )
                    })
                )
            })
        );
    };

    update = () => {
        this.broadcastCameraMovement();
    };

    broadcastCameraMovement = () => {
        // broadcast camera change from any any camera to all others
        let keys = Object.keys(this.fibers3dComponents);
        for(let key of keys) {
            if(!this.fibers3dComponents[key]) continue;
            this.fibers3dComponents[key].clearCameraListeners();
            if(!this.props.sync3dViews) {
                // continue, so listeners are not registered if user does not want to sync views
                continue;
            }
            this.fibers3dComponents[key].registerCameraListener((position, focalPoint, viewUp, clippingRange) => {
                for(let keyOther of keys) {
                    if(keyOther === key) continue;
                    if(!this.fibers3dComponents[keyOther]) continue;
                    this.fibers3dComponents[keyOther].setCamera(position, focalPoint, viewUp, clippingRange);
                }
            });
        }
    };

}
