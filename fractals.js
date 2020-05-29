let recursionsChosen = 0;
let canvas;

const scale = () => canvas.width*0.75;
const origin = () => ({ x: canvas.width/2, y: canvas.height/2 });

const translate = p => ({
    x: origin().x + p.x * scale(),
    y: origin().y + p.y * scale()
});

$(document).ready(function () {
    const elementId = "fractal-canvas";
    
    $(`#${elementId}`)
        .click(e => {
            recursionsChosen++;
            if (recursionsChosen > 7)
                recursionsChosen = 0;

            draw(canvas);
        });

    canvas = document.getElementById(elementId);
    draw(canvas);
});

function draw(canvas) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log(`Drawing with recursion level ${recursionsChosen}`);
    //drawSierpińskiTriangle(context, recursionsChosen);
    drawSierpińskiCarpet(context, recursionsChosen);
}

function drawSierpińskiCarpet(context, recursions){
    const outermostSquare = [
        { x: -0.5, y: -0.5  },
        { x: 0.5, y: -0.5  },
        { x: 0.5, y: 0.5  },
        { x: -0.5, y: 0.5  },
    ];
    drawPolygon(outermostSquare, context);

    drawInnerSierpińskiCarpet(outermostSquare, recursions, context);
}

function drawInnerSierpińskiCarpet(squarePoints, recursionsRemaining, context) {
    
    if (recursionsRemaining < 0)
        return;

    const originalWidth = squarePoints[1].x - squarePoints[0].x;
    const originalHeight = squarePoints[3].y - squarePoints[0].y;

    const segmentWidth = originalWidth/3;
    const segmentHeight = originalHeight/3;

    const segmentPoints = [
        { x: squarePoints[0].x,                   y: squarePoints[0].y },
        { x: squarePoints[0].x + segmentWidth,    y: squarePoints[0].y },
        { x: squarePoints[0].x + segmentWidth*2,  y: squarePoints[0].y },
        { x: squarePoints[0].x + segmentWidth*3,  y: squarePoints[0].y },

        { x: squarePoints[0].x,                   y: squarePoints[0].y + segmentHeight },
        { x: squarePoints[0].x + segmentWidth,    y: squarePoints[0].y + segmentHeight },
        { x: squarePoints[0].x + segmentWidth*2,  y: squarePoints[0].y + segmentHeight },
        { x: squarePoints[0].x + segmentWidth*3,  y: squarePoints[0].y + segmentHeight },

        { x: squarePoints[0].x,                   y: squarePoints[0].y + segmentHeight * 2 },
        { x: squarePoints[0].x + segmentWidth,    y: squarePoints[0].y + segmentHeight * 2 },
        { x: squarePoints[0].x + segmentWidth*2,  y: squarePoints[0].y + segmentHeight * 2 },
        { x: squarePoints[0].x + segmentWidth*3,  y: squarePoints[0].y + segmentHeight * 2 },

        { x: squarePoints[0].x,                   y: squarePoints[0].y + segmentHeight * 3 },
        { x: squarePoints[0].x + segmentWidth,    y: squarePoints[0].y + segmentHeight * 3 },
        { x: squarePoints[0].x + segmentWidth*2,  y: squarePoints[0].y + segmentHeight * 3 },
        { x: squarePoints[0].x + segmentWidth*3,  y: squarePoints[0].y + segmentHeight * 3 }
    ];

    drawFilledRectangle(segmentPoints[5], segmentWidth, segmentHeight, context);

    const nextRecursionsRemaining = recursionsRemaining - 1;

    drawInnerSierpińskiCarpet([ segmentPoints[0], segmentPoints[1], segmentPoints[5], segmentPoints[6] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[1], segmentPoints[2], segmentPoints[6], segmentPoints[5] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[2], segmentPoints[3], segmentPoints[7], segmentPoints[6] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[4], segmentPoints[5], segmentPoints[9], segmentPoints[8] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[6], segmentPoints[7], segmentPoints[11], segmentPoints[10] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[8], segmentPoints[9], segmentPoints[13], segmentPoints[12] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[9], segmentPoints[10], segmentPoints[14], segmentPoints[13] ], nextRecursionsRemaining, context);
    drawInnerSierpińskiCarpet([ segmentPoints[10], segmentPoints[11], segmentPoints[15], segmentPoints[14] ], nextRecursionsRemaining, context);
}

function drawSierpińskiTriangle(context, recursions){
    const outermostTriangle = [
        { x: -0.5, y: 0.5  },
        { x: 0,    y: -0.5 },
        { x: 0.5,  y: 0.5  }
    ];
    drawInnerSierpińskiTriangle(outermostTriangle, recursions, context);
}

function drawInnerSierpińskiTriangle(trianglePoints, recursionsRemaining, context) {
    
    if (recursionsRemaining < 0)
        return;

    drawPolygon(trianglePoints, context);

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

function drawPolygon(points, context) {

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

function drawFilledRectangle(topLeft, width, height, context) {
    const translatedTopLeft = translate(topLeft);
    //console.log(`>>> ${translatedTopLeft.x} ${translatedTopLeft.y} ${width} ${height}`);
    context.fillRect(translatedTopLeft.x, translatedTopLeft.y, width*scale(), height*scale());
}