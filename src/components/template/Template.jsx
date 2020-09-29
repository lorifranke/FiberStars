import React from "react";
import "./template.scss";

export default class Template extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.update();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.update();
    }

    render = function () {
        return (
            <div className={"template"}>
                {this.props.outsideValue}
            </div>
        );
    };

    update = () => {
        console.log("template component has been updated");
    };
}
