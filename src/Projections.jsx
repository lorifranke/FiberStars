import {MDSSGD, PivotMDS} from "hdsp2";
import TSNE from "tsne-js";
import {UMAP} from "umap-js";
import FSUtils from "./FSUtils";

export default class Projections {

    static mdssgd = (featureVectors) => {
        FSUtils.standardize(featureVectors);
        let layout = MDSSGD.project(featureVectors, 2);
        layout = FSUtils.normalize(layout);
        return layout;
    };

    static pivotMDS = (featureVectors) => {
        FSUtils.standardize(featureVectors);
        let layout = PivotMDS.project(featureVectors, 50, 2);
        layout = FSUtils.normalize(layout);
        return layout;
    };

    static tSNE = (featureVectors) => {
        FSUtils.standardize(featureVectors);
        let model = new TSNE({
            dim: 2,
            perplexity: 30.0,
            earlyExaggeration: 4.0,
            learningRate: 100.0,
            nIter: 1000,
            metric: 'euclidean'
        });

        model.init({
            data: featureVectors,
            type: 'dense'
        });

        model.run();

        let outputScaled = model.getOutputScaled();
        outputScaled = FSUtils.normalize(outputScaled);
        return outputScaled;
    };

    static umap = (featureVectors) => {
        FSUtils.standardize(featureVectors);
        const umap = new UMAP({
            nNeighbors: 4
        });
        let embedding = umap.fit(featureVectors);
        embedding = FSUtils.normalize(embedding);
        return embedding;
    };
}
