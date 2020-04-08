import './../../../style/app.css';

let DOC_FONTSIZE = parseFloat(getComputedStyle(document.querySelector("body")).fontSize);
export let SNOW_LAYER_HEIGHT = emToPx(0.5);
export let ROOF_ANGLE_INCREASE_UNIT = SNOW_LAYER_HEIGHT
export let MIN_NUM_ROOF_RAISES = 4;
export let NUM_LIVES = 3;
export let VOLUME_IS_MUTED = false;

// Number of columns to subtract
// from the maximum number of columns possible to fill a row.
// Used to prevent overflowing a grid.
export let COL_NUM_BUFFER = 2;

// Number of rows to subtract
// from the maximum number of rows possible to fill a column.
// Used to prevent overflowing a grid.
export let ROW_NUM_BUFFER = 1;

export let ROOF_TYPES = [
    {
        name: "wood",
        strength: 0
    },
    {
        name: "clay",
        strength: 1
    },
    {
        name: "concrete",
        strength: 2
    },
    {
        name: "metal",
        strength: 3
    },
];

export let HOUSE_TYPES = [
    {
        name: "brick",
        fillPattern: "",
        images: {
            bottomWindow: "./images/window-four-pane-metal-cool.svg",
            topWindow: "",
            door: "./images/door-double-white.svg"
        },
        imageWidth: emToPx(2),
        imageHeight: emToPx(2),
        classes: ["brick"]
    },
    {
        name: "stone",
        fillPattern: "",
        images: {
            bottomWindow: "./images/curved-window.svg",
            topWindow: "",
            door: "./images/door-double-white.svg"
        },
        imageWidth: emToPx(2),
        imageHeight: emToPx(2),
        classes: ["stone"]
    },
    {
        name: "shingle",
        fillPattern: "",
        images: {
            bottomWindow: "./images/window-gridded-vinly-cool.svg",
            topWindow: "",
            door: "./images/door-double-white.svg"
        },
        imageWidth: emToPx(2),
        imageHeight: emToPx(2),
        classes: ["shingle"]
    }
]

export let COLLAPSING_IMAGES = [
    {
        name: "collapsingHouse0",
        width: emToPx(10),
        height: emToPx(10),
        index: 0,
        bottom: 0,
        src: "./assets/House_Collapse_0.png"
    },
    {
        name: "collapsingHouse1",
        width: emToPx(10),
        height: emToPx(10),
        index: 1,
        src: "./assets/House_Collapse_1.png",
    },
    {
        name: "collapsingHouse2",
        width: emToPx(10),
        height: emToPx(10),
        index: 2,
        src: "./assets/House_Collapse_2.png",
    },
    {
        name: "collapsedHouse",
        width: emToPx(6),
        height: emToPx(6),
        index: 3,
        src: "./assets/Collapsed_Rubble.png",
    }
];


export const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));


// Return length in em units (adjusts for different viewport sizes)
export function pxToEm(pxNum) {
    return pxNum / DOC_FONTSIZE;
}

// Return length in px units. Useful fro modifying DOM in javascript.
export function emToPx(emNum) {
    return emNum * DOC_FONTSIZE;
}

export function getElemDimensions(className_) {

    let styleSheets = window.document.styleSheets;
    let styleSheetsLength = styleSheets.length;
    for(let i = 0; i < styleSheetsLength; i++){
        let classes = styleSheets[i].rules || styleSheets[i].cssRules;
        if (!classes)
            continue;
        let classesLength = classes.length;
        for (let x = 0; x < classesLength; x++) {
            if (classes[x].selectorText === className_) {
                let ret = {};
                ret["width"] = parseFloat(classes[x].style.width.slice(0, -2) || classes[x].width.slice(0, -2));
                ret["height"] = parseFloat(classes[x].style.height.slice(0, -2) || classes[x].height.slice(0, -2));
                ret["margin"] = parseFloat(classes[x].style.margin.slice(0, -2) || classes[x].margin.slice(0, -2));
                ret["padding"] = parseFloat(classes[x].style.padding.slice(0, -2) || classes[x].padding.slice(0, -2));
                return ret;
            }
        }
    }
}

export function randIntBetween(start, end) {
    return Math.floor((Math.random() * end) + start);
}

export function makeClassStr(classesArray) {
    let classStr = "";

    classesArray.forEach(element => {
        classStr += element + " ";
    });

    return classStr;
}

export function makePointStr(points) {
    let pointStr = "";
    for (let i = 0; i < points.length; i++) {
        pointStr += points[i].x + "," + points[i].y + " ";
    }
    return pointStr;
}