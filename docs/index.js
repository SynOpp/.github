const pointsPerPixel = 0.0004;
const maxDistance = 100;
const fadeStartDistance = 90;
const speed = 5;
const margin = 5;

const canvas = document.querySelector('canvas');

canvas.width = document.body.clientWidth * window.devicePixelRatio;
canvas.height = document.body.scrollHeight * window.devicePixelRatio;
const ctx = canvas.getContext('2d');
const points = [];

function createPoints() {
    const pointCount = pointsPerPixel * document.body.clientWidth * document.body.scrollHeight;
    console.log(`Creating ${pointCount} points`);

    points.splice(0);

    for (let i = 0; i < pointCount; i++) {
        let vx = (Math.random() - 0.5);
        let vy = (Math.random() - 0.5);
        let vl = Math.sqrt(vx * vx + vy * vy);
        vx = (vx / vl) * speed;
        vy = (vy / vl) * speed;

        points.push({
            x: Math.random() * canvas.width * window.devicePixelRatio,
            y: Math.random() * canvas.height * window.devicePixelRatio,
            vx,
            vy
        });
    }
}

function onResize() {
    canvas.width = document.body.clientWidth * window.devicePixelRatio;
    canvas.height = document.body.scrollHeight * window.devicePixelRatio;
    createPoints();
}

window.addEventListener('resize', onResize);
createPoints();

let time = Date.now();
function update() {
    const deltaTime = (Date.now() - time) / 1000;
    time = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        point.x += point.vx * deltaTime;
        point.y += point.vy * deltaTime;

        if (point.x < -margin) point.x = -margin;
        if (point.x > canvas.width + margin) point.x = canvas.width + margin;
        if (point.y < -margin) point.y = -margin;
        if (point.y > canvas.height + margin) point.y = canvas.height + margin;

        if (point.x == 0 || point.x == canvas.width) point.vx *= -1;
        if (point.y == 0 || point.y == canvas.height) point.vy *= -1;


        points.forEach(other => {
            if (point === other) return;
            const dx = point.x - other.x;
            const dy = point.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let alpha = dist < fadeStartDistance ? 1 : (1 - (dist - fadeStartDistance) / (maxDistance - fadeStartDistance));
            alpha = Math.max(0, Math.min(1, alpha));
            ctx.globalAlpha = alpha;

            ctx.strokeStyle = `#5396be`;

            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(update);
}

update();