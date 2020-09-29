import React from "react";
import "./toolbar.scss";

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBrain, 
    faUsers, 
    faArrowsAlt,
    faPaintBrush,
    faPalette,
    faBalanceScale,
    faBars
} from '@fortawesome/free-solid-svg-icons';
import {ColorGenerator} from "../../ColorGenerator";

export default class Toolbar extends React.Component {

    //static CLUSTERS = [...Array(10).keys()].map((value, index) => {
    //    // return "cluster_" + String(index + 1).padStart(5, '0');
    //    return "cluster_" + String(Math.round(Math.random() * 800)).padStart(5, '0');
    //});
    static CLUSTERS = [
        'cluster_00050', 'cluster_00100', 'cluster_00150', 'cluster_00200', 'cluster_00250', 'cluster_00300', 'cluster_00350',
        'cluster_00400', 'cluster_00450', 'cluster_00500', 'cluster_00550', 'cluster_00600', 'cluster_00650', 'cluster_00700',
        'cluster_00750', 'cluster_00800'
    ];

    static SUBJECTS = [ '101006', '107422', '136227', '162228', '204016'
    ];
    //[ '101', '103', '105', '106' , '107', '108', '109', '110', '201', '202', '204', '208', '210' ];
    static PROJECTIONS = [
        //{
        //    id: 'mdssgd',
        //    label: "MDSSDG"
        //},
        {
            id: 'pivotmds',
            label: "PivotMDS"
        },
        //{
        //    id: 'tsne',
        //    label: "t-SNE"
        //},
        //{
        //    id: 'umap',
        //    label: "UMAP"
        //}
    ];
    static DISTANCES = [
        {
            id: 'euclidean',
            label: "Weighted Euclidean"
        }
    ];
    static PROJECTION_COLORING = [
        {
            id: 'subjects',
            label: "Color by subjects"
        },
        {
            id: 'clusters',
            label: "Color by clusters"
        },
        {
            id: 'age',
            label: "Color by subject age"
        },
        {
            id: 'gender',
            label: "Color by subject gender"
        },
        {
            id: 'race',
            label: "Color by subject ethnicity"
        }
    ];


    constructor(props) {
        super(props);
        this.colorGenerator = ColorGenerator.getInstance();
    }

    componentDidMount() {

    }

    render = function () {
        return (
            <div className={"p-3"}>
                <div className="pt-2">
                    <h3 className="text-info m-0 p-0">
                        <FontAwesomeIcon icon={faBrain} className={"text-secondary logo"}/>&nbsp;
                        FIBER
                        <span className="text-success">STARS</span>
                    </h3>
                </div>
                {
                    /*******************************
                     * STANDARD CONTROLS
                     ********************************/
                }
                <Autocomplete
                    multiple={true}
                    small={"true"}
                    id="subjects=select"
                    className={"mt-4"}
                    options={Toolbar.SUBJECTS}
                    renderOption={
                        (option) =>
                            <Chip
                                size="small"
                                style={{
                                    background: this.colorGenerator.getBackgroundColor2(Toolbar.SUBJECTS.indexOf(option)),
                                    color: this.colorGenerator.getColor2(Toolbar.SUBJECTS.indexOf(option))
                                }}
                                label={option}
                            />
                    }
                    defaultValue={this.props.subjects}
                    value={this.props.subjects}
                    onChange={(e, value, reason) => {
                        this.props.onSubjectsChanged(value)
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                size="small"
                                style={{
                                    background: this.colorGenerator.getBackgroundColor2(Toolbar.SUBJECTS.indexOf(option)),
                                    color: this.colorGenerator.getColor2(Toolbar.SUBJECTS.indexOf(option))
                                }}
                                label={option} {...getTagProps({index})}
                            />
                        ))
                    }
                    style={{width: 240}}
                    renderInput={params => (
                        <TextField {...params} label={[<FontAwesomeIcon icon={faUsers}/>, " Subjects"]}
                                   variant="standard" placeholder="Search"/>
                    )}
                />

                <Autocomplete
                    multiple={true}
                    small={"true"}
                    id="tracts-select"
                    className={"mt-3"}
                    options={Toolbar.CLUSTERS}
                    renderOption={
                        (option) =>
                            <Chip
                                size="small"
                                style={{
                                    background: this.colorGenerator.getBackgroundColor(Toolbar.CLUSTERS.indexOf(option)),
                                    color: this.colorGenerator.getColor(Toolbar.CLUSTERS.indexOf(option))
                                }}
                                label={option.replace("cluster_", "")}

                            />
                    }
                    defaultValue={this.props.clusters}
                    value={this.props.clusters}
                    onChange={(e, value, reason) => {
                        this.props.onClustersChanged(value)
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                size="small"
                                style={{
                                    background: this.colorGenerator.getBackgroundColor(Toolbar.CLUSTERS.indexOf(option)),
                                    color: this.colorGenerator.getColor(Toolbar.CLUSTERS.indexOf(option))
                                }}
                                label={option.replace("cluster_", "")} {...getTagProps({index})}
                            />
                        ))
                    }
                    style={{width: 240}}
                    renderInput={params => (
                        <TextField {...params} label={[<FontAwesomeIcon icon={faBrain}/>, " Clusters"]}
                                   variant="standard" placeholder="Search"/>
                    )}
                />
                {
                    /********************************
                     * 3-D TOGGLE CONTROL
                     ********************************/
                }
                {
                    this.props.clusters.length > 0 &&
                    this.props.subjects.length > 0 &&
                    <FormControl className={"mt-3"} style={{display: "block"}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={this.props.threeDView}
                                    onChange={(e, value) => {
                                        this.props.onThreeDViewChanged(value)
                                    }}
                                />
                            }
                            label="Show clusters in 3D"
                        />
                    </FormControl>
                }
                {
                    /*******************************
                     * PROJECTION CONTROLS
                     ********************************/
                }
                {/*
                    this.props.clusters.length === 0 &&
                    this.props.subjects.length > 0 &&
                    <FormControl className={"mt-3"} style={{display: "block"}}>
                        <InputLabel shrink id="projection-select-label">
                            <ScatterPlotIcon/> Projection technique
                        </InputLabel>
                        <Select
                            labelId="projection-select-label"
                            id="projection-select"
                            value={this.props.projection}
                            onChange={
                                (e) => {
                                    this.props.onProjectionChanged(e.target.value);
                                }
                            }
                            style={{width: 240}}
                        >
                            {
                                Toolbar.PROJECTIONS.map((value, index) => {
                                    return (
                                        <MenuItem value={value.id}>{value.label}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </FormControl>*/
                }
                {/*
                    this.props.clusters.length === 0 &&
                    this.props.subjects.length > 0 &&
                    <FormControl className={"mt-3"} style={{display: "block"}} disabled>
                        <InputLabel shrink id="distance-select-label">
                            <FontAwesomeIcon icon={faArrowsAltH}/> Distance measure
                        </InputLabel>
                        <Select
                            labelId="distance-select-label"
                            id="distance-select"
                            value={"euclidean"}
                            style={{width: 240}}
                        >
                            {
                                Toolbar.DISTANCES.map((value, index) => {
                                    return (
                                        <MenuItem value={value.id}>{value.label}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </FormControl>*/
                }
                {
                    this.props.clusters.length === 0 &&
                    this.props.subjects.length > 0 &&
                    <Autocomplete
                        multiple={true}
                        small={"true"}
                        id="color-array-select"
                        className={"mt-3"}
                        options={this.props.colNames}
                        renderOption={
                            (option) =>
                                <Chip
                                    size="small"
                                    label={option}
                                />
                        }
                        defaultValue={this.props.projectionAttributes}
                        value={this.props.projectionAttributes}
                        onChange={(e, value) => {
                            this.props.onProjectionAttributesChanged(value)
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    size="small"
                                    label={option} {...getTagProps({index})}
                                />
                            ))
                        }
                        style={{width: 240}}
                        renderInput={params => (
                            <TextField {...params}
                                       label={[<FontAwesomeIcon icon={faBalanceScale}/>, " Weight on"]}
                                       variant="standard" placeholder="Search"/>
                        )}
                    />
                }
                {
                    this.props.clusters.length === 0 &&
                    this.props.subjects.length > 0 &&
                    <FormControl className={"mt-3"}>
                        <InputLabel shrink id="projection-coloring-select-label">
                            <FontAwesomeIcon icon={faPalette}/> Coloring
                        </InputLabel>
                        <Select
                            labelId="projection-coloring-select-label"
                            id="projection-coloring-select"
                            value={this.props.projectionColoring}
                            onChange={
                                (e) => {
                                    this.props.onProjectionColoringChanged(e.target.value);
                                }
                            }
                            style={{width: 240}}
                        >
                            {
                                Toolbar.PROJECTION_COLORING.map((value, index) => {
                                    return (
                                        <MenuItem value={value.id}>{value.label}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </FormControl>
                }
                {
                    /*******************************
                     * 3D VIEW CONTROLS
                     ********************************/
                }
                {
                    this.props.clusters.length > 0 &&
                    this.props.subjects.length > 0 &&
                    this.props.threeDView &&
                    <Autocomplete
                        small={"true"}
                        id="color-array-select"
                        className={"mt-3"}
                        options={this.props.colNames}
                        getOptionLabel={option => option}
                        defaultValue={this.props.colorArray}
                        value={this.props.colorArray}
                        onChange={(e, value) => {
                            this.props.onColorArrayChanged(value)
                        }}
                        style={{width: 240}}
                        renderInput={params => (
                            <TextField {...params}
                                       label={[<FontAwesomeIcon icon={faPaintBrush}/>, " Color by"]}
                                       variant="standard" placeholder="Search"/>
                        )}
                    />
                }
                {
                    this.props.clusters.length > 0 &&
                    this.props.subjects.length > 0 &&
                    this.props.threeDView &&
                    <Autocomplete
                        small={"true"}
                        id="color-map-select"
                        className={"mt-3"}
                        options={window.vtk.Rendering.Core.vtkColorTransferFunction.vtkColorMaps.rgbPresetNames}
                        getOptionLabel={option => option}
                        defaultValue={this.props.colorMap}
                        value={this.props.colorMap}
                        onChange={(e, value) => {
                            this.props.onColorMapChanged(value)
                        }}
                        style={{width: 240}}
                        renderInput={params => (
                            <TextField {...params}
                                       label={[<FontAwesomeIcon icon={faPalette}/>, " Color map"]}
                                       variant="standard" placeholder="Search"/>
                        )}
                    />
                }
                {
                    this.props.clusters.length > 0 &&
                    this.props.subjects.length > 0 &&
                    this.props.threeDView &&
                    <FormControl className={"mt-3"}>
                        <InputLabel shrink><FontAwesomeIcon icon={faArrowsAlt}/> 3D Sync</InputLabel>
                        <FormControlLabel
                            control={<Checkbox defaultChecked={this.props.sync3dViews} color="primary"/>}
                            label="Synchronize views"
                            labelPlacement="end"
                            className={"toolbarCheckbox"}
                            onChange={(e, value) => {
                                this.props.onSync3dViews(value)
                            }}
                        />
                    </FormControl>
                }
                {
                    /********************************
                     * MULTI CLUSTER VIEW CONTROLS
                     ********************************/
                }
                {
                    this.props.clusters.length > 0 &&
                    this.props.subjects.length > 0 &&
                    !this.props.threeDView &&
                    <FormControl className={"mt-3"}>
                        <InputLabel shrink id="rowMode-select-label">
                            <FontAwesomeIcon icon={faBars}/> Row mode
                        </InputLabel>
                        <Select
                            labelId="rowMode-select-label"
                            id="rowMode-select"
                            value={this.props.rowMode}
                            onChange={
                                (e) => {
                                    this.props.onRowModeChanged(e.target.value);
                                }
                            }
                            style={{width: 240}}
                        >
                            <MenuItem value={"subjects"}>Subjects in rows</MenuItem>
                            <MenuItem value={"clusters"}>Clusters in rows</MenuItem>
                        </Select>
                    </FormControl>
                }
            </div>
        );
    };
}
