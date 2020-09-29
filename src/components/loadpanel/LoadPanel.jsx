import React from "react";
import "./loadpanel.scss";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default class LoadPanel extends React.Component {

    componentDidMount = () => {
        this.update();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.update();
    }

    render = function () {
        return (
            <div className="loadpanel">
                <Typography>{this.props.text}</Typography>
                <CircularProgress variant="static" value={this.props.value}
                />
            </div>
        );
    };

    update = () => {

    };
}
