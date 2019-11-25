function resizeCircle(data) {
    let radius = data["PR comments"] / 2;
    if (radius < 37) {
        // a too small circle will affect the readability of word...
        radius = 37;
    }
    return radius;
}

function resizeEdge(data) {
    return edgeSizeHelper(data.approves);
}

function edgeSizeHelper(value) {
    let thickness = value / 20;
    if (thickness > 18) thickness = 18;
    else if (thickness < 1) thickness = 1;

    return thickness;
}

function resizeText(data) {
    let fontSize = data["PR comments"] / 9;
    if (fontSize < 11) fontSize = 11;

    return fontSize;
}

module.exports = {
    resizeCircle: resizeCircle,
    resizeEdge: resizeEdge,
    edgeSizeHelper: edgeSizeHelper,
    resizeText: resizeText
};