
const menuToggle = document.getElementById('menu-toggle');
const menuIcon = document.getElementById('menu-icon');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    } else {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
    }
}

menuToggle.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    });
});

function handleFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Transmissão Enviada com Sucesso!';
    btn.classList.add('bg-green-600', 'text-white');

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600', 'text-white');
        e.target.reset();
    }, 3000);
}

const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const planeWidth = 70;
const planeHeight = 70;
const gridSegments = 45;

const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, gridSegments, gridSegments);

const material = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.22
});

const gridMesh = new THREE.Mesh(geometry, material);
gridMesh.rotation.x = -Math.PI / 2.3;
gridMesh.position.y = -8;
scene.add(gridMesh);

const starsCount = 400;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
    starsPositions[i] = (Math.random() - 0.5) * 100;
    starsPositions[i + 1] = (Math.random() - 0.5) * 70;
    starsPositions[i + 2] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.5,
    transparent: true,
    opacity: 0.7
});
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

camera.position.z = 22;
camera.position.y = 4;

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function updatePointerPosition(clientX, clientY) {
    targetX = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    targetY = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
}

window.addEventListener('mousemove', (e) => {
    updatePointerPosition(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    gridMesh.rotation.z = currentX * 0.15;
    starField.rotation.y = elapsedTime * 0.02 + currentX * 0.05;

    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        const distance = Math.sqrt(x * x + y * y);
        const z = Math.sin(distance * 0.25 - elapsedTime * 1.8) * 0.7 + Math.cos(x * 0.2 + elapsedTime) * 0.3;

        positions.setZ(i, z);
    }
    positions.needsUpdate = true;

    renderer.render(scene, camera);
}

window.onload = function () {
    animate();
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
