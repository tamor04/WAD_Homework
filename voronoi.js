const canvas = document.getElementById('voronoiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize points and colors
let points = createPoints(50, canvas.width, canvas.height);
let colors = points.map(() => `hsl(${Math.random() * 360}, 100%, 80%)`);
drawVoronoi();

// Function to draw the Voronoi diagram
function drawVoronoi() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let closestPointIndex = getClosestPointIndex(x, y);
            ctx.fillStyle = colors[closestPointIndex];
            ctx.fillRect(x, y, 1, 1); // Draw a 1x1 pixel at (x, y)
        }
    }
}

// Function to get the closest point index
function getClosestPointIndex(x, y) {
    let closestIndex = -1;
    let closestDistance = Infinity;

    points.forEach((point, index) => {
        const dx = point.x - x;
        const dy = point.y - y;
        const distance = dx * dx + dy * dy; // Use squared distance for performance
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

// Function to create initial random points
function createPoints(numPoints, width, height) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({ x: Math.random() * width, y: Math.random() * height });
    }
    return points;
}

// Resize event
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawVoronoi(); // Redraw Voronoi when resized
});

// Click event to add new point
document.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add new point at click location with a random color
    points.push({ x: x, y: y });
    colors.push(`hsl(${Math.random() * 360}, 100%, 80%)`); // Generate a new color for the new point

    drawVoronoi(); // Redraw Voronoi with the updated points
});
