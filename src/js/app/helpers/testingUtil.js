export function printVertices(vertices) {
    console.log("### VERTICES ###");
    for (let i = 0; i < vertices.length; i++) {
        console.log(vertices[i].x + ", " + vertices[i].y);
    }
    console.log("#####");
}