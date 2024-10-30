// Select the canvas and set up dimensions
const canvas = document.getElementById("voronoiCanvas");
const context = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const voronoi = d3.voronoi().extent([[0, 0], [width, height]]);

// Load banana image
const bananaImage = new Image();
bananaImage.src = 'img/banana.png'; // Ensure this path is correct

// Generate a random banana-themed color
function getRandomColor() {
    const random = Math.random();
    if (random < 0.5) {
        const r = 255;
        const g = Math.floor(220 + Math.random() * 35);
        const b = Math.floor(Math.random() * 50);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    } else if (random < 0.8) {
        const r = Math.floor(150 + Math.random() * 50);
        const g = 255;
        const b = Math.floor(100 + Math.random() * 50);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    } else {
        const r = Math.floor(139 + Math.random() * 40);
        const g = Math.floor(69 + Math.random() * 50);
        const b = 19;
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    }
}

/* Default color palette
// Generate a random color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // Semi-transparent for overlap effect
}
*/

// Function to draw the banana image with rotation and maintaining aspect ratio
function drawRotatedImage(image, x, y, width, height, angle) {
    context.save(); // Save the current canvas state
    context.translate(x, y); // Move to the center of the banana position
    context.rotate(angle); // Rotate to match the angle of the Voronoi cell
    context.drawImage(image, -width / 2, -height / 2, width, height); // Draw the image, centered
    context.restore(); // Restore the canvas state
}

// Configuration with stored colors
const numPoints = 50;
const points = Array.from({ length: numPoints }, () => ({
    position: [Math.random() * width, Math.random() * height],
    velocity: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
    color: getRandomColor(),
    rotation: Math.random() * Math.PI * 2, // Random initial rotation angle
    rotationDirection: Math.random() < 0.5 ? 1 : -1 // Randomize rotation direction (1 = clockwise, -1 = counterclockwise)
}));

// Track the currently dragged point
let draggedPoint = null;

// Animate points with smooth directional movement
function animateVoronoi() {
    context.clearRect(0, 0, width, height);

    // Update each point’s position, velocity, and rotation for smoother movement
    points.forEach(point => {
        if (point !== draggedPoint) {
            // Update velocity and position
            point.velocity[0] += (Math.random() - 0.5) * 0.1;
            point.velocity[1] += (Math.random() - 0.5) * 0.1;

            const speed = Math.hypot(point.velocity[0], point.velocity[1]);
            if (speed > 1) {
                point.velocity[0] *= 0.9 / speed;
                point.velocity[1] *= 0.9 / speed;
            }

            point.position[0] += point.velocity[0];
            point.position[1] += point.velocity[1];

            // Bounce off edges
            if (point.position[0] < 0 || point.position[0] > width) point.velocity[0] *= -1;
            if (point.position[1] < 0 || point.position[1] > height) point.velocity[1] *= -1;

            // Update rotation angle based on rotation direction
            point.rotation += 0.01 * point.rotationDirection; // Set a constant rotation speed
        }
    });

    const diagram = voronoi(points.map(p => p.position));

    // Draw each cell with its stored color
    diagram.polygons().forEach((cell, i) => {
        context.beginPath();
        cell.forEach(([x, y], index) => {
            if (index === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        });
        context.closePath();

        context.fillStyle = points[i].color; // Fill with color
        context.fill();

        // Get the centroid of the cell
        const centroid = d3.polygonCentroid(cell);
        const bananaSize = 50; // Set the desired size for the banana image

        // Draw the banana image centered at the centroid, rotated
        drawRotatedImage(bananaImage, centroid[0], centroid[1], bananaSize, bananaSize * (bananaImage.naturalHeight / bananaImage.naturalWidth), points[i].rotation);
    });

    requestAnimationFrame(animateVoronoi); // Continue animation
}

// Event listeners for mouse interactions
document.addEventListener("mousedown", event => {
    const x = event.clientX;
    const y = event.clientY;

    draggedPoint = {
        position: [x, y],
        velocity: [0, 0],
        color: getRandomColor(),
        rotation: Math.random() * Math.PI * 2, // New point with random rotation
        rotationDirection: Math.random() < 0.5 ? 1 : -1 // New point with random rotation direction
    };

    points.push(draggedPoint); // Add the new point to points array
});

document.addEventListener("mousemove", event => {
    if (draggedPoint) {
        draggedPoint.position[0] = event.clientX;
        draggedPoint.position[1] = event.clientY;
    }
});

document.addEventListener("mouseup", () => {
    draggedPoint = null;
});

// Resize event listener
window.addEventListener('resize', () => {
    // Update canvas dimensions
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Update the Voronoi diagram extent
    voronoi.extent([[0, 0], [width, height]]);
});

// Start the animation after the image is loaded
bananaImage.onload = () => {
    animateVoronoi();
};

// made using D3.js and ChatGPT