import React from "react";
import "./Fibers3d.scss";
import FSUtils from "../../FSUtils";

export default class Fibers3d extends React.Component {

    static BRAIN_OBJ_FILE = "meshmyfaceintoyours.obj";

    constructor(props) {
        super(props);
        this.cameraListeners = [];
    }

    componentDidMount = () => {
        this.update();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.update();
    }

    render = function () {
        return (
            <div className="fibers3d border-right border-left border-dark">
                <div id={this.props.canvasId} className={"canvas"}></div>
            </div>
        );
    };

    update = () => {
        const what = FSUtils.getDataPath(this.props.subject, this.props.cluster, 'vtp');
        const renderWindow = window.vtk.Rendering.Core.vtkRenderWindow.newInstance();
        const renderer = window.vtk.Rendering.Core.vtkRenderer.newInstance();
        this.camera = window.vtk.Rendering.Core.vtkCamera.newInstance();
        renderer.setActiveCamera(this.camera);
        renderWindow.addRenderer(renderer);

        const container = document.getElementById(this.props.canvasId);
        container.innerHTML = "";
        if (!container) {
            throw Error("Container not found");
        }
        const rect = container.getBoundingClientRect();

        const openGLRenderWindow = window.vtk.Rendering.OpenGL.vtkRenderWindow.newInstance();
        openGLRenderWindow.setContainer(container);
        openGLRenderWindow.setSize(rect.width, rect.height);

        renderWindow.addView(openGLRenderWindow);

        const interactor = window.vtk.Rendering.Core.vtkRenderWindowInteractor.newInstance();
        interactor.setInteractorStyle(window.vtk.Interaction.Style.vtkInteractorStyleTrackballCamera.newInstance());
        interactor.setView(openGLRenderWindow);
        interactor.initialize();
        interactor.bindEvents(container);

        const reader = window.vtk.IO.XML.vtkXMLPolyDataReader.newInstance();
        const actor = window.vtk.Rendering.Core.vtkActor.newInstance();

        // render fibers
        this.loadAndRenderFibers(reader, renderer, renderWindow, actor, what);

        /* render brain
        const brain_reader = window.vtk.IO.Misc.vtkOBJReader.newInstance();
        const brain_actor = window.vtk.Rendering.Core.vtkActor.newInstance();
        this.loadAndRenderBrain(brain_reader, renderer, renderWindow, brain_actor); */

        renderWindow.render();
        this.renderWindow = renderWindow;

        this.camera.onModified(() => {
            for(let listener of this.cameraListeners) {
                listener(this.camera.getPosition(), this.camera.getFocalPoint(), this.camera.getViewUp(), this.camera.getClippingRange());
            }
        });
    };



    loadAndRenderFibers = (reader, renderer, renderWindow, actor, what) => {
        let that = this;
        reader.setUrl(what).then( function () {

            const polydata = reader.getOutputData();
            // const arrayName = polydata.getPointData().getArrayName(0);
            const activeArray = polydata.getPointData().getArrays()[0];
            // const dataRange = activeArray.getRange();

            const lookupTable = window.vtk.Rendering.Core.vtkColorTransferFunction.newInstance();
            // const presetNames = window.vtk.Rendering.Core.vtkColorTransferFunction.vtkColorMaps.rgbPresetNames;
            const preset = window.vtk.Rendering.Core.vtkColorTransferFunction.vtkColorMaps.getPresetByName(that.props.colorMap);
            lookupTable.setVectorModeToMagnitude();
            lookupTable.applyColorMap(preset);
            // lookupTable.setMappingRange(dataRange[0], dataRange[1]);
            lookupTable.setMappingRange(that.props.min, that.props.max);
            lookupTable.updateRange();

            const mapper = window.vtk.Rendering.Core.vtkMapper.newInstance();
            mapper.setInputData(polydata);
            mapper.setLookupTable(lookupTable);
            mapper.setUseLookupTableScalarRange(true);
            mapper.setColorByArrayName(that.props.colorArray);
            mapper.setColorModeToMapScalars();
            mapper.setInterpolateScalarsBeforeMapping();
            mapper.setScalarModeToUsePointFieldData();
            mapper.setScalarVisibility(true);

            actor.setMapper(mapper);

            renderer.addActor(actor);

            renderer.resetCamera();
            renderWindow.render();
        });
    };

/*
    loadAndRenderBrain = (reader, renderer, renderWindow, actor) => {
        reader.setUrl(Fibers3d.BRAIN_OBJ_FILE).then(function () {
            const nbOutputs = reader.getNumberOfOutputPorts();
            for (let idx = 0; idx < nbOutputs; idx++) {
                const source = reader.getOutputData(idx);
                const mapper = window.vtk.Rendering.Core.vtkMapper.newInstance();
                actor.setMapper(mapper);
                mapper.setInputData(source);
                renderer.addActor(actor);
            }
            actor.setScale(30, 30, 30);
            actor.setPosition(0, -100, 0); // use origin of reference system
            actor.getProperty().setOpacity(0.1);

            renderer.resetCamera();
            renderWindow.render();
        });
    }; */

    clearCameraListeners() {
        while(this.cameraListeners.length > 0) {
            this.cameraListeners.pop();
        }
    }

    registerCameraListener(listener) {
        this.cameraListeners.push(listener);
    }

    setCamera(position, focalPoint, viewUp, clippingRange) {
        this.camera.setPosition(position[0], position[1], position[2]);
        this.camera.setFocalPoint(focalPoint[0], focalPoint[1], focalPoint[2]);
        this.camera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
        this.camera.setClippingRange(clippingRange[0], clippingRange[1]);
        this.renderWindow.render();
    }
}
