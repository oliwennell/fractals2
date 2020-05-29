let canvas, context;

$(document).ready(function () {
    canvas = document.getElementById('fractal-canvas');
    context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    const points = [
        { x: -0.5, y: 0.5 },
        { x: 0, y: -0.5 },
        { x: 0.5, y: 0.5 },
        { x: -0.5, y: 0.5 },
    ];
    drawShape(points);
});

function drawShape(points) {
    const scale = 100;
    const origin = { x: canvas.width/2, y: canvas.height/2 };

    const translate = p => ({x: origin.x + p.x * scale, y: origin.y + p.y * scale });

    const start = translate(points[0]);
    console.log(`start ${start.x} : ${start.y}`);
    context.moveTo(start.x, start.y);

    for (let j = 1; j < points.length; ++j) {
        const p = translate(points[j]);
        console.log(`line to ${p.x} : ${p.y}`);
        context.lineTo(p.x, p.y);
    }
    context.stroke();
}