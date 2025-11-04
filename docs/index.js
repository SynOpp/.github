const pointsPerPixel = 0.0004;
const maxDistance = 100;
const fadeStartDistance = 90;
const speed = .3;
const margin = 100;

const canvas = document.querySelector('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.scrollHeight;
const ctx = canvas.getContext('2d');

const pointCount = pointsPerPixel * canvas.width * canvas.height;
console.log(`Creating ${pointCount} points`);
const points = [];

for (let i = 0; i < pointCount; i++) {
    let vx = (Math.random() - 0.5);
    let vy = (Math.random() - 0.5);
    let vl = Math.sqrt(vx * vx + vy * vy);
    vx = (vx / vl) * speed;
    vy = (vy / vl) * speed;

    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx,
        vy
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0) point.x = 0;
        if (point.x > canvas.width) point.x = canvas.width;
        if (point.y < 0) point.y = 0;
        if (point.y > canvas.height) point.y = canvas.height;

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

            ctx.strokeStyle = `#0078d7ff`;

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