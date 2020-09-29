import "./Radial.scss";
import React from "react";
import * as d3 from "d3";

import FSUtils from "../../FSUtils";

export default class Radial extends React.Component {

    render = function () {
        let padding = 75;
        this.crad = Number(this.props.crad);
        this.ccx = this.crad / 2 + padding;
        this.ccy = this.crad / 2 + padding;

        let num_cols = this.props.data.col_names.length;

        return (
            <div className={"radial"}>
                <svg width={this.crad * 2 + padding} height={this.crad * 2 + padding}>
                    <circle
                        className={"main"}
                        cx={this.ccx}
                        cy={this.ccy}
                        r={this.crad}
                        stroke={"#2d2d2d"}
                        fill={"#2d2d2d33"}
                    >
                    </circle>
                    <circle
                        cx={this.ccx}
                        cy={this.ccy}
                        r={this.crad * .25}
                        stroke={"#474747"}
                        fill={"none"}
                    />
                    <circle
                        cx={this.ccx}
                        cy={this.ccy}
                        r={this.crad * .5}
                        stroke={"#474747"}
                        fill={"none"}
                    />
                    <circle
                        cx={this.ccx}
                        cy={this.ccy}
                        r={this.crad * .75}
                        stroke={"#474747"}
                        fill={"none"}
                    />
                    {
                        FSUtils.rangeZeroTo(num_cols).map((k) => {
                            const angle = -Math.PI / 2 + k * (Math.PI * 2 / num_cols);
                            const uv = Radial.endpoint(this.crad, angle, this.ccx, this.ccy);
                            let axisElements = [];
                            // add axis
                            let axis =
                                <line
                                    x1={this.ccx}
                                    y1={this.ccy}
                                    x2={uv[0]}
                                    y2={uv[1]}
                                    stroke={"#474747"}
                                    strokeWidth={1}
                                    strokeDasharray={1}
                                />;
                            axisElements.push(axis);

                            // add axis label
                            let labelParts = this.props.data.col_names[k].match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
                            let elementLength = 0;
                            let axisLabel =
                                <text
                                    className={"legend"}
                                    fontSize={"10px"}
                                    fontFamily={"monospace"}
                                    // display={"none"}
                                    textAnchor={"middle"}
                                    fill={"white"}
                                    stroke={"0"}
                                    x={uv[0]}
                                    dx={uv[0] > this.ccx && "15px"
                                        || uv[0] < this.ccx && "-15px"}
                                    y={uv[1]}
                                    dy={uv[1] > this.ccy && "10px"
                                        || uv[1] < this.ccy && "-10px"}
                                >
                                    {
                                        labelParts.map((element) => {
                                            if(elementLength <= 5 ) {
                                                elementLength += element.length;
                                                return (
                                                    <tspan>{element}</tspan>
                                                )
                                            } else {
                                                elementLength += element.length;
                                                return (
                                                    <tspan dx={-6.2 * (elementLength - element.length)} dy="10">{element}</tspan>
                                                )
                                            }
                                        })
                                    }
                                </text>;
                            axisElements.push(axisLabel);

                            // add ticks
                            for (let t = 0.25; t < 1; t += 0.25) {
                                const d1 = t + 0.0025;
                                const d2 = t - 0.0025;
                                const t1 = Radial.endpoint(d1 * this.crad, angle, this.ccx, this.ccy);
                                const t2 = Radial.endpoint(d2 * this.crad, angle, this.ccx, this.ccy);
                                let tick =
                                    <line
                                        x1={t1[0]}
                                        y1={t1[1]}
                                        x2={t2[0]}
                                        y2={t2[1]}
                                        stroke={"#d1d1d1"}
                                        strokeWidth={7}
                                    />;
                                axisElements.push(tick);
                            }
                            return axisElements;
                        })
                    }
                    <defs>
                        <mask
                            id={"hole"}
                        >
                            <rect
                                width={"100%"}
                                height={"100%"}
                                fill={"white"}
                            />
                            {
                                this.drawLine(this.props.data.mean_minus_std, 'mask',false)
                            }
                        </mask>
                    </defs>
                    {
                        this.drawLine(this.props.data.mean, 'mean',false)
                    }
                    {
                        this.drawLine(this.props.data.mean_plus_std,'std',   true)
                    }
                </svg>
            </div>
        );
    };

    // register mouse events
        //d3.select(`#${this.props.canvasId}_circle`).on("mouseenter", () => {
        //    d3.select(`#${this.props.canvasId}`).selectAll(`text.legend`).style("display", "block");
        //});
        //d3.select(`#${this.props.canvasId}_circle`).on("mouseleave", () => {
        //    d3.select(`#${this.props.canvasId}`).selectAll(`text.legend`).style("display", "none");
        //});

    drawLine = (values, color, draw_label) => {
        let path = d3.path();
        let svgElements = [];
        for (let k = 0; k < values.length; k++) {
            // Draw line for std
            const min = this.props.data.raw_data.colMinima[k];
            const max = this.props.data.raw_data.colMaxima[k];
            const a = values[k];
            const d = (a - min) / (max - min);
            const angle = -Math.PI / 2 + k * (Math.PI * 2 / values.length);
            const uv = Radial.endpoint(d * this.crad, angle, this.ccx, this.ccy);
            if (k === 0) {
                path.moveTo(uv[0], uv[1]);
            } else {
                path.lineTo(uv[0], uv[1]);
            }
            if (draw_label) {
                // Draw values / numbers on the axes
                let zero = d3.format("0.3r");
                let label = <text
                    fontSize={"9px"}
                    fontFamily={"Verdana"}
                    fill={"white"}
                    textAnchor={"middle"}
                    x={uv[0]}
                    y={uv[1]}
                >
                    {
                        zero(values[k])
                    }
                </text>;
                svgElements.push(label);
            }
        }
        path.closePath();
        if (color === 'std') {
            svgElements.push(
                <path
                    d={path}
                    fill={"#FF990066"}
                    mask={"url(#hole)"}
                />
            );
        } else if (color === 'mean') {
            svgElements.push(
                <path
                    d={path}
                    stroke={"orange"}
                    fill={"none"}
                    strokeWidth={2}
                />
            );
        } else if (color === 'mask') {
            svgElements.push(
                <path
                    d={path}
                    fill={"black"}
                />
            );
        }
        return svgElements;
    };

    // compute endpoint position
    static endpoint = (r, angle, x, y) => {
        const u = r * Math.cos(angle) + x;
        const v = r * Math.sin(angle) + y;
        return [u, v];
    };
}
