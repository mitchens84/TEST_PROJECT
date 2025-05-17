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

    d3.json("../../data/sample-chart-data.json").then(data => {
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


// React Counter Component (using Babel for JSX)
const reactRoot = document.getElementById('react-app-root');
if (reactRoot && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const Counter = () => {
        const [count, setCount] = React.useState(0);
        return (
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
            </div>
        );
    };
    ReactDOM.render(<Counter />, reactRoot);
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
