import React from "react";
import "./StatBox.scss";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Badge from 'react-bootstrap/Badge';
import { faUser, faBrain } from '@fortawesome/free-solid-svg-icons'
import {ColorGenerator} from "../../ColorGenerator";
import Toolbar from './../toolbar/Toolbar';
import FSUtils from '../../FSUtils';
import Tooltip from '@material-ui/core/Tooltip';

/* add min/max fiber length */

export default class StatBox extends React.Component {

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.update();
    }

    render = function () {
        if(this.props.data) {
            return (
                <div className="statbox">
                    {
                    <table className={"mt-1"}>
                        <thead>
                            <tr>
                                <th>
                                    <h6>
                                        <Tooltip
                                            disableHoverListener={!this.props.compact}
                                            title={
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                Age
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {this.props.metadata.age}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span
                                                                style={{fontSize: "10px", color: "#ccc"}}>
                                                                    Gender
                                                                </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {this.props.metadata.gender}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                Height (inch):
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {this.props.metadata.height}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                Weight (lbs)
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {this.props.metadata.weight}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            }
                                        >
                                            <Badge
                                                style={{
                                                    background: ColorGenerator.getInstance().getBackgroundColor2(Toolbar.SUBJECTS.indexOf(this.props.subject)),
                                                    color: ColorGenerator.getInstance().getColor2(Toolbar.SUBJECTS.indexOf(this.props.subject))
                                                }}>
                                                <FontAwesomeIcon icon={faUser}/> {this.props.subject}
                                            </Badge>
                                        </Tooltip>
                                    </h6>
                                </th>
                                <th>
                                    <h6>
                                        <Tooltip
                                            disableHoverListener={!this.props.compact}
                                            title={
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                Mean Fiber Length
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {FSUtils.round(this.props.data.meanLineLength, 3)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                {this.props.data.raw_data.cellNames[3]}
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {FSUtils.round(this.props.data.meanTotalFiberSimilarity, 3)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                {this.props.data.raw_data.cellNames[4]}
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {FSUtils.round(this.props.data.meanMeasuredFiberSimilarity, 3)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{fontSize: "10px", color: "#ccc"}}>
                                                                Number of Fibers
                                                            </span><br/>
                                                            <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                                                {this.props.data.raw_data.lines.length}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            }
                                        >
                                            <Badge
                                                style={{
                                                    background: ColorGenerator.getInstance().getBackgroundColor(Toolbar.CLUSTERS.indexOf(this.props.cluster)),
                                                    color: ColorGenerator.getInstance().getColor(Toolbar.CLUSTERS.indexOf(this.props.cluster))
                                                }}>
                                                <FontAwesomeIcon icon={faBrain}/> {this.props.cluster.replace("cluster_", "")}
                                            </Badge>
                                        </Tooltip>
                                    </h6>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            !this.props.compact &&
                            <tr>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        Age
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {this.props.metadata.age}
                                    </span>
                                </td>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        Mean Fiber Length
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {FSUtils.round(this.props.data.meanLineLength, 3)}
                                    </span>
                                </td>
                            </tr>
                        }
                        {

                            !this.props.compact &&
                            <tr>
                                <td>
                            <span
                                style={{fontSize: "10px", color: "#ccc"}}>
                                        Gender
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {this.props.metadata.gender}
                                    </span>
                                </td>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        {this.props.data.raw_data.cellNames[3]}
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {FSUtils.round(this.props.data.meanTotalFiberSimilarity, 3)}
                                    </span>
                                </td>
                            </tr>
                        }
                        {
                            !this.props.compact &&
                            <tr>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        Height (inch):
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {this.props.metadata.height}
                                    </span>
                                </td>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        {this.props.data.raw_data.cellNames[4]}
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {FSUtils.round(this.props.data.meanMeasuredFiberSimilarity, 3)}
                                    </span>
                                </td>
                            </tr>
                        }
                        {
                            !this.props.compact &&
                            <tr>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        Weight (lbs)
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {this.props.metadata.weight}
                                    </span>
                                </td>
                                <td>
                                    <span style={{fontSize: "10px", color: "#ccc"}}>
                                        Number of Fibers
                                    </span><br/>
                                    <span style={{fontSize: "14px", lineHeight: "10px"}}>
                                        {this.props.data.raw_data.lines.length}
                                    </span>
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>
                    }
                </div>
            );
        } else {
            return (
                <div className="statbox">
                    Loading...
                </div>
            )
        }
    };

    update = () => {
        // whatever needs to be updated after new cluster comes in here
        // console.log(this.props.data);
    };

}
