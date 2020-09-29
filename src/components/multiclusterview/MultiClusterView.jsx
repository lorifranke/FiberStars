import React from "react";
import "./multiclusterview.scss";
import Radial from './../radial/Radial';
import StatBox from './../statbox/StatBox';

import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

export default class MultiClusterView extends React.Component {

    constructor(props) {
        super(props);
        this.classes = makeStyles(theme => ({
          root: {
            flexGrow: 1,
          }
        }));
    }

    render = function () {

        return (
            <div className={this.classes.root}>
                {
                    this.props.rowMode === "subjects" &&
                    this.props.subjects.map((subject, sIdx) => {
                        return (
                            <Grid container spacing={0} className={"multiClusterColumn"}>
                                {
                                    this.props.clusters.map((cluster, cIdx) => {
                                        return this.renderView(this.props.data, this.props.metadata, subject, cluster);
                                    })
                                }
                            </Grid>
                        )
                    })
                }
                {
                    this.props.rowMode === "clusters" &&
                    this.props.clusters.map((cluster, cIdx) => {
                        return (
                            <Grid container spacing={0} className={"multiClusterColumn"}>
                                {
                                    this.props.subjects.map((subject, sIdx) => {
                                        return this.renderView(this.props.data, this.props.metadata, subject, cluster);
                                    })
                                }
                            </Grid>
                        )
                    })
                }
            </div>
        );
    };

    renderView = (data, metadata, subject, cluster) => {
        return (
            <Grid item xs>
                <div className="stat-box">
                    <StatBox
                        data={data[subject][cluster]}
                        metadata={metadata[subject]}
                        subject={subject}
                        cluster={cluster}
                        compact={true}
                    />
                </div>
                <div className="radial-box">
                    <Radial
                        crad={75}
                        data={data[subject][cluster]}
                    />
                </div>
            </Grid>
        );
    }
}
