

function resizeCircle(data) {
    return data["PR reviews"] / 2;
}

function resizeEdge(data) {

}

function resizeText(data) {
    return data["PR reviews"] / 7;
}

module.exports = {
    resizeCircle: resizeCircle,
    resizeEdge: resizeEdge,
    resizeText: resizeText
}