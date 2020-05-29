let recursionsChosen = 0;
let canvas;

$(document).ready(function () {
    const elementId = "fractal-canvas";
    
    $(`#${elementId}`)
        .click(e => {
            recursionsChosen++;
            if (recursionsChosen > 7)
                recursionsChosen = 1;

            draw(canvas);
        });

    canvas = document.getElementById(elementId);
    draw(canvas);
});

function draw(canvas) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawSierpińskiTriangle(context, recursionsChosen);
}

function drawSierpińskiTriangle(context, recursions){
    const outermostTriangle = [
        { x: -0.5, y: 0.5 },
        { x: 0, y: -0.5 },
        { x: 0.5, y: 0.5 }
    ];
    drawInnerSierpińskiTriangle(outermostTriangle, recursions, context);
}

function drawInnerSierpińskiTriangle(trianglePoints, recursionsRemaining, context) {
    
    if (recursionsRemaining < 0)
        return;

    drawTriangle(trianglePoints, context);

    const midPoints = [
        midPoint(trianglePoints[0], trianglePoints[1]),
        midPoint(trianglePoints[1], trianglePoints[2]),
        midPoint(trianglePoints[2], trianglePoints[0])
    ];

    const nextRecursionsRemaining = recursionsRemaining - 1;
    drawInnerSierpińskiTriangle([ midPoints[0], trianglePoints[1], midPoints[1] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiTriangle([ midPoints[2], midPoints[1], trianglePoints[2] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiTriangle([ trianglePoints[0], midPoints[0], midPoints[2] ], nextRecursionsRemaining, context);
}

function midPoint(a, b) {
    return {
        x: a.x + (b.x - a.x) / 2,
        y: a.y + (b.y - a.y) / 2
    }
}

function drawTriangle(points, context) {
    const scale = canvas.width*0.75;
    const origin = { x: canvas.width/2, y: canvas.height/2 };

    const translate = p => ({x: origin.x + p.x * scale, y: origin.y + p.y * scale });

    const start = translate(points[0]);
    //console.log(`start ${start.x} : ${start.y}`);

    context.beginPath();
    context.moveTo(start.x, start.y);

    for (let j = 1; j < points.length; ++j) {
        const p = translate(points[j]);
        //console.log(`line to ${p.x} : ${p.y}`);
        context.lineTo(p.x, p.y);
    }

    context.lineTo(start.x, start.y);
    context.stroke();
}