
const COLORS = [
    "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462",
    "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"
];

const COLORS2 = [
    "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
    "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"
];

let INSTANCE = null;

export class ColorGenerator {

    constructor() {
        this.reset();
    }

    static getInstance = () => {
        if(ColorGenerator.INSTANCE == null) {
            ColorGenerator.INSTANCE = new ColorGenerator();
        }
        return ColorGenerator.INSTANCE;
    };

    getBackgroundColor = (index) => {
        if (!this.colors[index]) {
            this.colors[index] = this.randomColor();
        }
        return this.colors[index];
    };

    getBackgroundColor2 = (index) => {
        if (!this.colors2[index]) {
            this.colors2[index] = this.randomColor();
        }
        return this.colors2[index];
    };

    getColor = (index) => {
        return this.lightOrDark(this.getBackgroundColor(index)) === "light" ? "black" : "white";
    };

    getColor2 = (index) => {
        return this.lightOrDark(this.getBackgroundColor2(index)) === "light" ? "black" : "white";
    };

    randomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    reset = () => {
        this.colors = {};
        COLORS.map((value, index) => {
            this.colors[index] = value;
        });
        this.colors2 = {};
        COLORS2.map((value, index) => {
            this.colors2[index] = value;
        });
    };

    lightOrDark = (color) => {
        // Variables for red, green, blue values
        var r, g, b, hsp;

        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {

            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

            r = color[1];
            g = color[2];
            b = color[3];
        } else {

            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace(
                color.length < 5 && /./g, '$&$&'));

            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 127.5) {

            return 'light';
        } else {

            return 'dark';
        }
    };

    getColorForAge = (age) => {
        if (age === "22") {
            return '#fdd0a2';
        } else if (age === "24") {
            return '#fdae6b';
        } else if (age === "25") {
            return '#fd8d3c';
        } else if (age === "31") {
            return '#e6550d';
        } else if (age === "35") {
            return '#a63603';
        } else {
            return '#000';
        }
    };

    getColorForGender = (gender) => {
        if (gender === "F") {
            return '#e41a1c';
        } else {
            return '#377eb8';
        }
    };

    getColorForRace = (race) => {
        if (race.toLowerCase().includes("black")) {
            return '#66c2a5';
        } else if(race.toLowerCase().includes("asian")) {
            return '#fc8d62';
        } else if(race.toLowerCase().includes("white")) {
            return '#8da0cb';
        }
    }
}
