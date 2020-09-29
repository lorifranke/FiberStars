import React from 'react';
import './scss/App.scss';
import Toolbar from './components/toolbar/Toolbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FSUtils from "./FSUtils";
import ProjectionView from "./components/projectionview/ProjectionView";
import MultiClusterView from "./components/multiclusterview/MultiClusterView";
import LoadPanel from "./components/loadpanel/LoadPanel";
import SplitScreenView from "./components/splitscreen/SplitScreenView";
import Projections from "./Projections";
import Drawer from '@material-ui/core/Drawer';


export default class App extends React.Component {

    state = {
        // controller
        clusters: [],
        subjects: [],
        sync3dViews: false,
        threeDView: false,
        projection: "pivotmds",
        projectionColoring: "subjects",
        rowMode: "subjects",

        projectionAttributes: [],

        data: {},
        metadata: FSUtils.loadMetadata(),

        layout: null,
        colorArray: "trace2",
        colorMap: "rainbow"
    };

    componentDidMount = () => {
        this.update();
    };

    setRowMode = (rowMode) => {
        this.state.rowMode = rowMode;
        this.update();
    };

    setProjection = (projection) => {
        this.state.projection = projection;
        this.state.layout = null; // reset layout
        this.update();
    };

    setProjectionColoring = (projectionColoring) => {
        this.state.projectionColoring = projectionColoring;
        this.update();
    };

    setClusters = (clusters) => {
        this.state.clusters = clusters;
        // this.state.layout = null; // reset layout
        this.update();
    };

    setSubjects = (subjects) => {
        this.state.subjects = subjects;
        this.state.layout = null; // reset layout
        this.update();
    };

    setSync3dViews = (sync3dViews) => {
        this.state.sync3dViews = sync3dViews;
        this.update();
    };

    setThreeDView = (threeDView) => {
        this.state.threeDView = threeDView;
        this.update();
    };

    setColorArray = (colorArray) => {
        this.state.colorArray = colorArray;
        this.update();
    };

    setProjectionAttributes = (projectionAttributes) => {
        this.state.projectionAttributes = projectionAttributes;
        this.state.layout = null; // reset layout
        this.update();
        console.log(this.state.projectionAttributes);
    };

    setColorMap= (colorMap) => {
        this.state.colorMap = colorMap;
        this.update();
    };

    render = () => {
        // calculate loading progress
        let total = this.state.subjects.length * Toolbar.CLUSTERS.length;
        let progress = 0;
        this.state.subjects.map((subject, index) => {
            if (this.state.data[subject]) {
                progress += Object.keys(this.state.data[subject]).length;
            }
        });
        progress = Math.round(progress / total * 100);
        let noSubjectsSelected = this.state.subjects.length === 0;
        let loading = progress < 100;
        let computingLayout = !noSubjectsSelected && !loading && Object.keys(this.state.layout).length === 0;
        let layoutReady = !noSubjectsSelected && !loading && !computingLayout;
        return (
            [
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={true}
                >
                    <div className={"mainmenu"}>
                        <Toolbar
                            onClustersChanged={this.setClusters}
                            onSubjectsChanged={this.setSubjects}
                            onSync3dViews={this.setSync3dViews}
                            onThreeDViewChanged={this.setThreeDView}
                            onColorArrayChanged={this.setColorArray}
                            onColorMapChanged={this.setColorMap}
                            onProjectionChanged={this.setProjection}
                            onProjectionColoringChanged={this.setProjectionColoring}
                            onProjectionAttributesChanged={this.setProjectionAttributes}
                            onRowModeChanged={this.setRowMode}
                            clusters={this.state.clusters}
                            subjects={this.state.subjects}
                            projection={this.state.projection}
                            projectionColoring={this.state.projectionColoring}
                            sync3dViews={this.state.sync3dViews}
                            threeDView={this.state.threeDView}
                            colorArray={this.state.colorArray}
                            rowMode={this.state.rowMode}
                            projectionAttributes={this.state.projectionAttributes}
                            colorMap={this.state.colorMap}
                            colNames={
                                (
                                    // this.state.subjects.length > 0 &&
                                    // this.state.clusters.length > 0 &&
                                    this.state.data[this.state.subjects[0]] &&
                                    this.state.data[this.state.subjects[0]][Toolbar.CLUSTERS[0]]
                                ) ? this.state.data[this.state.subjects[0]][Toolbar.CLUSTERS[0]].col_names : []
                            }
                        />
                    </div>
                </Drawer>
                ,
                <Container fluid className={"h-100 p-0"}
                           style={{marginLeft: "274px", maxWidth: "calc(100% - 274px)", overflow: "scroll"}}>
                    {
                        <Row className={"h-100"} noGutters={"true"}>
                            {
                                noSubjectsSelected &&
                                <Col xs={12}>
                                    <LoadPanel
                                        value={0}
                                        text={"No subjects selected."}
                                    />
                                </Col>
                            }
                            {
                                loading &&
                                <Col xs={12}>
                                    <LoadPanel
                                        value={progress}
                                        text={"Loading, please wait..."}
                                    />
                                </Col>
                            }
                            {
                                computingLayout &&
                                <Col xs={12}>
                                    <LoadPanel
                                        value={100}
                                        text={"Computing layout, please wait..."}
                                    />
                                </Col>
                            }
                            {
                                layoutReady && this.state.clusters.length === 0 &&
                                <Col xs={12}>
                                    <ProjectionView
                                        subjects={this.state.subjects}
                                        data={this.state.data}
                                        metadata={this.state.metadata}
                                        layout={this.state.layout}
                                        onClustersSelected={this.setClusters}
                                        colorBy={this.state.projectionColoring}
                                    />
                                </Col>
                            }
                            {
                                progress === 100 && this.state.clusters.length > 0 && this.state.threeDView &&
                                <SplitScreenView
                                    subjects={this.state.subjects}
                                    clusters={this.state.clusters}
                                    sync3dViews={this.state.sync3dViews}
                                    data={this.state.data}
                                    metadata={this.state.metadata}
                                    colorArray={this.state.colorArray}
                                    colorMap={this.state.colorMap}
                                />
                            }
                            {
                                progress === 100 && this.state.clusters.length > 0 && !this.state.threeDView &&
                                <MultiClusterView
                                    data={this.state.data}
                                    metadata={this.state.metadata}
                                    subjects={this.state.subjects}
                                    clusters={this.state.clusters}
                                    rowMode={this.state.rowMode}
                                />
                            }
                        </Row>
                    }
                </Container>
            ]
        );
    };

    update = () => {
        for(let subject of this.state.subjects) {
            if (!this.state.data[subject]) {
                // init data set for new subject
                this.state.data[subject] = {};
            }
            let dataset = this.state.data[subject];
            if (Object.keys(dataset).length < Toolbar.CLUSTERS.length) {
                // not all clusters are loaded yet
                for (let cluster of Toolbar.CLUSTERS) {
                    if (dataset[cluster]) {
                        // this one was already loaded
                        continue;
                    }
                    FSUtils.load(
                        subject,
                        cluster,

                        (raw_data) => {
                            console.log("Loaded cluster '" + cluster + "' of subject '" + subject + "'");
                            dataset[cluster] = FSUtils.wrapAndComputeStatistics(raw_data, raw_data.colNames);
                            FSUtils.updateExtrema(raw_data.colNames, dataset);
                            this.computeLayout(); // refresh layout (case when subject added)
                            this.setState({});
                        },
                        (error) => {
                            console.log("Could not load cluster '" + cluster + "' of subject '" + subject + "': " + error);
                            console.error(error);
                        }
                    );
                }
            }
        }
        this.computeLayout(); // refresh layout (case when subject removed)
        this.setState({});
    };

    computeLayout= () => {
        if(this.state.layout !== null) {
            // layout has been computed already
            return;
        }
        if(this.state.subjects.length === 0) {
            // nothing to layout
            return;
        }
        // only compute layout if all clusters are loaded for all selected subjects
        for(let subject of this.state.subjects) {
            let dataset = this.state.data[subject];
            if (Object.keys(dataset).length !== Toolbar.CLUSTERS.length) {
                return;
            }
        }
        this.state.layout = {};
        // attributes to take into account in distance measure
        let selectedAttributes = null;
        if(this.state.projectionAttributes.length > 0) {
            // if any is selected, load index for each selected projection attribute
            selectedAttributes = [];
            let colNames = this.state.data[this.state.subjects[0]][Toolbar.CLUSTERS[0]].col_names;
            for(let selectedAttribute of this.state.projectionAttributes) {
                selectedAttributes.push(colNames.indexOf(selectedAttribute));
            }
        } else {
            // take all attributes
            let numCols = this.state.data[this.state.subjects[0]][Toolbar.CLUSTERS[0]].col_names.length;
            selectedAttributes = FSUtils.rangeZeroTo(numCols);
        }
        // collect feature vectors
        let featureVectors = [];
        for(let subject of this.state.subjects) {
            let dataset = this.state.data[subject];
            if (!this.state.layout[subject]) {
                Toolbar.CLUSTERS.map((cluster, index) => { // X-REF-1 Order by Toolbar.CLUSTERS
                    let vector = [];
                    for (let i = 0; i < dataset[cluster].num_cols; i++) {
                        if(selectedAttributes.includes(i)) {
                            vector.push(dataset[cluster].mean[i]);
                            // vector[i] = dataset[cluster].std[i];
                        }
                    }
                    featureVectors.push(vector);
                });
            }
        }
        // project layout
        let layout;
        switch(this.state.projection) {
            case "mdssgd":
                layout = Projections.mdssgd(featureVectors);
                break;
            case "pivotmds":
                layout = Projections.pivotMDS(featureVectors);
                break;
            case "tsne":
                layout = Projections.tSNE(featureVectors);
                break;
            case "umap":
                layout = Projections.umap(featureVectors);
                break;
        }

        // extract coordinates
        this.state.subjects.map((subject, sIndex) => {
            this.state.layout[subject] = layout.slice(sIndex * Toolbar.CLUSTERS.length, (sIndex+1) * Toolbar.CLUSTERS.length);
        });
    };
}

