var THREE = require("three");

var targetRotationX = 0.5;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0.2;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var slowingFactor = 0.05;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	100,
	window.innerWidth / window.innerHeight,
	1,
	10000
);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

plane = new THREE.Mesh(
	new THREE.PlaneGeometry(200, 200),
	new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
);
plane.rotation.x = -90 * (Math.PI / 180);
plane.overdraw = true;

var geometry = new THREE.BoxGeometry(700, 700, 700, 10, 10, 10);
var material = new THREE.MeshBasicMaterial({
	color: 0xff0b0b,
	wireframe: true,
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 1000;

document.addEventListener("mousedown", onDocumentMouseDown, false);

animate();

function animate() {
	requestAnimationFrame(animate);

	render();
}

function render() {
	rotateAroundWorldAxis(cube, new THREE.Vector3(0, 1, 0), targetRotationX);
	rotateAroundWorldAxis(cube, new THREE.Vector3(1, 0, 0), targetRotationY);

	targetRotationY = targetRotationY * (1 - slowingFactor);
	targetRotationX = targetRotationX * (1 - slowingFactor);
	renderer.render(scene, camera);
}

function rotateAroundObjectAxis(object, axis, radians) {
	var rotationMatrix = new THREE.Matrix4();

	rotationMatrix.makeRotationAxis(axis.normalize(), radians);
	object.matrix.multiply(rotationMatrix);
	object.rotation.setFromRotationMatrix(object.matrix);
}

function rotateAroundWorldAxis(object, axis, radians) {
	var rotationMatrix = new THREE.Matrix4();

	rotationMatrix.makeRotationAxis(axis.normalize(), radians);
	rotationMatrix.multiply(object.matrix); // pre-multiply
	object.matrix = rotationMatrix;
	object.rotation.setFromRotationMatrix(object.matrix);
}

function onDocumentMouseDown(event) {
	event.preventDefault();

	document.addEventListener("mousemove", onDocumentMouseMove, false);
	document.addEventListener("mouseup", onDocumentMouseUp, false);
	document.addEventListener("mouseout", onDocumentMouseOut, false);

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDownX = targetRotationX;

	mouseYOnMouseDown = event.clientY - windowHalfY;
	targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;

	targetRotationX = (mouseX - mouseXOnMouseDown) * 0.00025;

	mouseY = event.clientY - windowHalfY;

	targetRotationY = (mouseY - mouseYOnMouseDown) * 0.00025;
}

function onDocumentMouseUp(event) {
	document.removeEventListener("mousemove", onDocumentMouseMove, false);
	document.removeEventListener("mouseup", onDocumentMouseUp, false);
	document.removeEventListener("mouseout", onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
	document.removeEventListener("mousemove", onDocumentMouseMove, false);
	document.removeEventListener("mouseup", onDocumentMouseUp, false);
	document.removeEventListener("mouseout", onDocumentMouseOut, false);
}
