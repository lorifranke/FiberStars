import Papa from "papaparse";

export default class FSUtils {

    static load = (subject, cluster, successCallback, errorCallback) => {
        const reader = window.vtk.IO.XML.vtkXMLPolyDataReader.newInstance();
        reader.setUrl(FSUtils.getDataPath(subject, cluster,'vtp')).then(() => {
            const polydata = reader.getOutputData();
            const data = {
              lines: [],
              colMinima: [],
              colMaxima: [],
              colNames: [],
              numPoints: [],
              cellNames: [],
              cellMinima: [],
              cellMaxima: [],
              totalFiberSimilarity: [],
              measuredFiberSimilarity: []
            };
            for (let i = 0; i < polydata.getPointData().getNumberOfArrays(); i++) {
              const name = polydata.getPointData().getArrayName(i);
              data.colNames.push(name);
            }
            const celldata = polydata.getCellData();
            data.totalFiberSimilarity = celldata.getArrays()[3].getData();
            data.measuredFiberSimilarity = celldata.getArrays()[4].getData();
            for (let i = 0; i < celldata.getNumberOfArrays(); i++) {
              const name = celldata.getArrayName(i);
              data.cellNames.push(name);
            }
            data.numPoints = polydata.getNumberOfPoints();
            const ls = polydata.getLines().getData();
            const cs = polydata.getPoints().getData();
            let num_points = 0;
            let line = null;
            for (let i = 0; i < ls.length; i++) {
              if (i === num_points) {
                if (line) {
                  data.lines.push(line);
                }
                line = [];
                num_points += ls[i] + 1;
              } else {
                const point = {
                  x: cs[3 * ls[i]],
                  y: cs[3 * ls[i] + 1],
                  z: cs[3 * ls[i] + 2],
                  value: new Array(data.colNames.length)
                };
                for (let k = 0; k < data.colNames.length; k++) {
                  point.value[k] = polydata.getPointData().getArrays()[k].getData()[ls[i]];
                }
                line.push(point);
              }
            }
            data.lines.push(line);
            // load minima und maxima of point scalars
            for (let k = 0; k < data.colNames.length; k++) {
              data.colMinima.push(polydata.getPointData().getArrays()[k].getRange()[0]);
              data.colMaxima.push(polydata.getPointData().getArrays()[k].getRange()[1]);
            }
            // load minima and maxima of cell arrays
             for (let k = 0; k < data.cellNames.length; k++) {
              data.cellMinima.push(polydata.getCellData().getArrays()[k].getRange()[0]);
              data.cellMaxima.push(polydata.getCellData().getArrays()[k].getRange()[1]);
            }
            successCallback(data);
        }, (error) => {
            errorCallback(error);
        })
    };

    static getDataPath = (subj, cluster, format) => {
        return `data/${subj}/${cluster}.${format}`;
        // return `data/${subj}/tracts_left_hemisphere/${cluster}.${format}`;
    };

    static loadMetadata = () => {
        const metadata = {};
        Papa.parse("data/subjects.csv", {
            download: true,
            complete: function(results) {
                for (let row of results.data) {
                    let subjectMetadata = {
                        subjectId: row[0],
                        age: row[1],
                        gender: row[2],
                        race: row[3],
                        height: row[4],
                        weight: row[5]
                    }
                    metadata[row[0]] = subjectMetadata;
                }
            }
        });
        return metadata;
    };

    static wrapAndComputeStatistics = (raw_data, col_names) => {
        let num_cols = col_names.length;
        let result = {
            raw_data: raw_data,
            num_cols: num_cols,
            variance: new Array(num_cols),
            mean: new Array(num_cols),
            count: new Array(num_cols),
            std: new Array(num_cols),
            mean_plus_std: new Array(num_cols),
            mean_minus_std: new Array(num_cols),
            col_names: col_names,
            meanTotalFiberSimilarity: new Array(raw_data.totalFiberSimilarity.length),
            meanMeasuredFiberSimilarity: new Array(raw_data.measuredFiberSimilarity.length),
            meanLineLength: new Array(raw_data.lines.length)
        };
        // Calculate means per line and for all lines (for value see above)
        for (let k = 0; k < num_cols; k++) {
            result.mean[k] = 0;
            result.count[k] = 0;
            for (let j = 0; j < raw_data.lines.length; j++) {
                let line = raw_data.lines[j];
                if(line) {
                    for (let i = 0; i < line.length; i++) {
                        if (Number.isNaN(line[i].value[k])) {
                            continue;
                        }
                        result.mean[k] += line[i].value[k];
                        result.count[k]++;
                    }
                }
            }
            result.mean[k] /= result.count[k];
        }
        // compute standard deviation
        for (let k = 0; k < num_cols; k++) {
            result.variance[k] = 0;
            for (let j = 0; j < raw_data.lines.length; j++) {
                let line = raw_data.lines[j];
                if(line) {
                    for (let i = 0; i < line.length; i++) {
                        if (Number.isNaN(line[i].value[k])) {
                            continue;
                        }
                        result.variance[k] += (line[i].value[k] - result.mean[k]) ** 2;
                    }
                }
            }
            result.variance[k] /= result.count[k];
            result.std[k] = Math.sqrt(result.variance[k]);
            result.mean_plus_std[k] = result.mean[k] + result.std[k];
            result.mean_minus_std[k] = result.mean[k] - result.std[k];
        }
        // Calculate mean for totalFiberSimilarity
        let sum = 0;
        let count = 0;
        for (let f = 0; f < raw_data.totalFiberSimilarity.length; f++) {
                if (Number.isNaN(raw_data.totalFiberSimilarity[f])) {
                    continue;
                }
                sum += raw_data.totalFiberSimilarity[f];
                count++;
            }
            result.meanTotalFiberSimilarity = sum / count;

        // Calculate means for measuredFiberSimilarity
        sum = 0;
        count = 0;
        for (let f = 0; f < raw_data.measuredFiberSimilarity.length; f++) {
                if (Number.isNaN(raw_data.totalFiberSimilarity[f])) {
                    continue;
                }
                sum += raw_data.measuredFiberSimilarity[f];
                count++;
            }
            result.meanMeasuredFiberSimilarity = sum / count;

         // Calculate mean Fiber length
        result.meanLineLength = raw_data.numPoints /raw_data.lines.length;

        return result;
    };

    static updateExtrema = (col_names, dataset) => {
        let min = new Array(col_names.length);
        let max = new Array(col_names.length);
        for(let k = 0; k < col_names.length; k++) {
            min[k] = Number.MAX_VALUE;
            max[k] = Number.MIN_VALUE;
        }
        for(let key of Object.keys(dataset)) {
            let data = dataset[key];
            for(let k = 0; k < col_names.length; k++) {
                min[k] = Math.min(min[k], data.raw_data.colMinima[k]);
                max[k] = Math.max(max[k], data.raw_data.colMaxima[k]);
            }
        }
        for(let key of Object.keys(dataset)) {
            let data = dataset[key];
            for(let k = 0; k < col_names.length; k++) {
                data.raw_data.colMinima[k] = min[k];
                data.raw_data.colMaxima[k] = max[k];
          }
        }
    };

    // round value to fixed number of decimals
    static round = (value, decimals) => {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };

    /**
     * Compute z-Score on feature vectors.
     *
     * @param featureVectors
     */
    static standardize = (featureVectors) => {
        let num_components = featureVectors[0].length;
        // compute means
        let means = new Array(num_components);
        for(let k = 0; k < num_components; k++) {
            means[k] = 0;
            for(let i = 0; i < featureVectors.length; i++) {
                means[k] += featureVectors[i][k];
            }
            means[k] /= featureVectors.length;
        }
        // compute standard deviations
        let stdevs = new Array(num_components);
        for(let k = 0; k < num_components; k++) {
            stdevs[k] = 0;
            for(let i = 0; i < featureVectors.length; i++) {
                stdevs[k] += Math.pow(featureVectors[i][k] - means[k], 2);
            }
            stdevs[k] /= featureVectors.length;
            stdevs[k] = Math.sqrt(stdevs[k]);
        }
        // compute z-Scores
        for(let i = 0; i < featureVectors.length; i++) {
            for(let k = 0; k < num_components; k++) {
                featureVectors[i][k] = (featureVectors[i][k] - means[k]) / stdevs[k];
            }
        }

        // sanity check
        means = new Array(num_components);
        for(let k = 0; k < num_components; k++) {
            means[k] = 0;
            for(let i = 0; i < featureVectors.length; i++) {
                means[k] += featureVectors[i][k];
            }
            means[k] /= featureVectors.length;
        }
        // compute standard deviations
        stdevs = new Array(num_components);
        for(let k = 0; k < num_components; k++) {
            stdevs[k] = 0;
            for(let i = 0; i < featureVectors.length; i++) {
                stdevs[k] += Math.pow(featureVectors[i][k] - means[k], 2);
            }
            stdevs[k] /= featureVectors.length;
            stdevs[k] = Math.sqrt(stdevs[k]);
        }
    };

    static rangeZeroTo = (end) => {
        return FSUtils.range(0, end);
    };

    static range = (start, end) => {
        let nums = [];
        for (let i = start; i < end; i++) {
            nums.push(i);
        }
        return nums;
    };

    static normalize = (coordinates) => {
        let D = coordinates[0].length;
        let min = FSUtils.fillArray(D, Number.MAX_VALUE);
        let max = FSUtils.fillArray(D, Number.MIN_VALUE);
        let x;
        for (let i = 0; i < coordinates.length; i++) {
            for (let d = 0; d < D; d++) {
                x = coordinates[i][d];
                if (x < min[d]) {
                    min[d] = x;
                }
                if (x > max[d]) {
                    max[d] = x;
                }
            }
        }
        let length, longestLength = 0;
        for (let d = 0; d < D; d++) {
            length = max[d] - min[d];
            if (length > longestLength) {
                longestLength = length;
            }
        }
        for (let d = 0; d < D; d++) {
            for (let i = 0; i < coordinates.length; i++) {
                x = coordinates[i][d];
                coordinates[i][d] = (x - min[d]) / longestLength;
            }
        }
        return coordinates;
    };

    static fillArray = (N, value) => {
        let result = [];
        for (let n = 0; n < N; n++) {
            result.push(value);
        }
        return result;
    };
}
