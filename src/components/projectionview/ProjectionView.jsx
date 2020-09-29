import React from "react";
import "./projectionview.scss";
import Toolbar from '../toolbar/Toolbar';

import * as d3 from "d3";
import {ColorGenerator} from "../../ColorGenerator";
import Radial from "../radial/Radial";
import Tooltip from '@material-ui/core/Tooltip';
import StatBox from "../statbox/StatBox";

export default class ProjectionView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            radius: 5,
            canvasPadding: 100,

            dragging: false,
            ox: null,
            oy: null,
            dx: null,
            dy: null,
            selectedClusters: {}
        };
    }

    render = function () {
        let pointLocations = [];
        let toolbarWidth = d3.select(".mainmenu").node().getBoundingClientRect().width;
        // compute canvas dimensions
        const canvasWidth = window.innerWidth - toolbarWidth;
        const canvasHeight = window.innerHeight;
        return (
            <svg
                width={canvasWidth}
                height={canvasHeight}
                className="projection"
                onMouseDown={
                    (e) => {
                        this.setState({
                            dragging: true,
                            ox: e.pageX - toolbarWidth,
                            oy: e.pageY,
                            dx: e.pageX  - toolbarWidth,
                            dy: e.pageY,
                        });
                    }
                }
                onMouseMove={
                    (e) => {
                        if(this.state.dragging) {
                            this.state.selectedClusters = {};
                            pointLocations.map((point, index) => {
                                if (
                                    point.x > Math.min(this.state.ox, this.state.dx) &&
                                    point.x < Math.max(this.state.ox, this.state.dx) &&
                                    point.y > Math.min(this.state.oy, this.state.dy) &&
                                    point.y < Math.max(this.state.oy, this.state.dy)
                                ) {
                                    this.state.selectedClusters[point.cluster] = true;
                                }
                            });
                            this.setState({
                                dx: e.pageX - toolbarWidth,
                                dy: e.pageY
                            });
                        }
                    }
                }
                onMouseUp={
                    (e) => {
                        this.setState({
                            dragging: false,
                            ox: null,
                            oy: null,
                            dx: null,
                            dy: null,
                            selectedClusters: {}
                        });
                        let selectedClusters = [];
                        Object.keys(this.state.selectedClusters).map((cluster, index) => {
                            if(this.state.selectedClusters[cluster]) {
                                selectedClusters.push(cluster);
                            }
                            return true;
                        });
                        if(selectedClusters.length > 0) {
                            this.props.onClustersSelected(selectedClusters);
                        }
                    }
                }
            >
                {
                    this.state.dragging &&
                    <rect
                        x={Math.min(this.state.ox, this.state.dx)}
                        y={Math.min(this.state.oy, this.state.dy)}
                        width={Math.abs(this.state.dx - this.state.ox)}
                        height={Math.abs(this.state.dy - this.state.oy)}
                        fill={"#4457ff33"}
                        stroke={"#4457ff"}
                        strokeWidth={1}
                    />
                }
                {
                    this.props.subjects.map((subject, index) => {
                        let coordinates = this.props.layout[subject];
                        let dataset = this.props.data[subject];
                        // render points
                        let points = [];
                        for (let i = 0; i < coordinates.length; i++) {
                            let data = dataset[Toolbar.CLUSTERS[i]]; // X-REF-1 Ordered by Toolbar.CLUSTERS
                            let cluster = Toolbar.CLUSTERS[i];

                            let color;
                            if(this.props.colorBy === "subjects") {
                                color = ColorGenerator.getInstance().getBackgroundColor2(Toolbar.SUBJECTS.indexOf(subject));
                            } else if (this.props.colorBy === "clusters") {
                                color = ColorGenerator.getInstance().getBackgroundColor(Toolbar.CLUSTERS.indexOf(cluster));
                            } else if (this.props.colorBy === "age") {
                                let age = this.props.metadata[subject].age;
                                color = ColorGenerator.getInstance().getColorForAge(age)
                            } else if (this.props.colorBy === "gender") {
                                let gender = this.props.metadata[subject].gender;
                                color = ColorGenerator.getInstance().getColorForGender(gender)
                            } else if (this.props.colorBy === "race") {
                                let race = this.props.metadata[subject].race;
                                color = ColorGenerator.getInstance().getColorForRace(race)
                            }
                            let cx = coordinates[i][0] * (canvasWidth - 2 * this.state.canvasPadding) + this.state.canvasPadding;
                            let cy = coordinates[i][1] * (canvasHeight - 2 * this.state.canvasPadding) + this.state.canvasPadding;
                            points.push(
                                <Tooltip
                                    style={{display: "inline-block"}}
                                    title={
                                        <div>
                                            <StatBox
                                                data={this.props.data[subject][cluster]}
                                                metadata={this.props.metadata[subject]}
                                                subject={subject}
                                                cluster={cluster}
                                            />
                                            <Radial
                                                crad={75}
                                                data={this.props.data[subject][cluster]}
                                            />
                                        </div>
                                    }
                                >
                                    <circle
                                        className={"point"}
                                        cx={cx}
                                        cy={cy}
                                        r={this.state.radius}
                                        strokeWidth={1}
                                        stroke={this.state.selectedClusters[cluster] ? "#000": "#fff"}
                                        fill={color}
                                        fillOpacity={Object.keys(this.state.selectedClusters).length === 0 ? 0.8 : this.state.selectedClusters[cluster] ? 0.8 : 0.2}
                                        onClick={() => {
                                            d3.select(".projectionTooltip").remove();
                                            this.props.onClustersSelected([Toolbar.CLUSTERS[i]]);
                                        }}
                                        style={{cursor: "pointer"}}
                                    />
                                </Tooltip>
                            );
                            pointLocations.push({cluster: cluster, x: cx, y: cy});
                        }
                        return points;
                    })
                }
            </svg>
        );
    };
}
