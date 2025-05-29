// Get correct base path for loading resources
function getBasePath() {
    // If we're in an iframe, get the top window's location
    try {
        if (window.top && window.top !== window) {
            // We're in an iframe - use absolute path from the main site
            const topOrigin = window.top.location.origin;
            const topPathname = window.top.location.pathname;
            // Remove index.html if present
            const basePath = topPathname.replace(/\/[^\/]*\.html$/, '');
            return `${topOrigin}${basePath}/`;
        }
    } catch (e) {
        // Cross-origin iframe, can't access parent
        console.warn('Cannot access parent window, using relative paths');
    }
    
    // Default to relative path resolution
    return '../../';
}

// D3.js Bar Chart
const d3Container = document.getElementById('d3-chart-container');
if (d3Container) {
    const margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#d3-chart-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const basePath = getBasePath();
    const dataPath = `${basePath}data/sample-chart-data.json`;
    console.log('Loading D3 data from:', dataPath);
    
    d3.json(dataPath).then(data => {
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.label))
            .padding(0.2);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.label))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "#69b3a2");
    }).catch(error => {
        console.error('Error loading D3 chart data:', error);
        d3Container.innerHTML = '<p>Error loading chart data. See console.</p>';
    });
} else {
    console.warn('D3 chart container not found.');
}

// Three.js Spinning Cube
const threeContainer = document.getElementById('threejs-canvas-container');
if (threeContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    const camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
    threeContainer.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x007bff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animateThreeJs() {
        requestAnimationFrame(animateThreeJs);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animateThreeJs();
} else {
    console.warn('Three.js container or THREE library not found.');
    if (threeContainer) threeContainer.innerHTML = '<p>Three.js could not be initialized. Check console.</p>';
}


// React Counter Component (using plain JavaScript, no JSX)
const reactRoot = document.getElementById('react-app-root');
if (reactRoot && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const Counter = () => {
        const [count, setCount] = React.useState(0);
        return React.createElement('div', null,
            React.createElement('p', null, `You clicked ${count} times`),
            React.createElement('button', {
                onClick: () => setCount(count + 1),
                style: { padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }
            }, 'Click me')
        );
    };
    ReactDOM.render(React.createElement(Counter), reactRoot);
} else {
    console.warn('React root or React/ReactDOM libraries not found.');
    if (reactRoot) reactRoot.innerHTML = '<p>React component could not be initialized. Check console.</p>';
}

// Internal Page Navigation Smooth Scroll (Optional)
document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
