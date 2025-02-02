import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/free-nature-images.jpg')

const geometry = new THREE.PlaneGeometry(1.5, 1, 32, 32)

const material = new THREE.ShaderMaterial({
    fragmentShader: fragment,
    vertexShader: vertex,
    uniforms: {
        uFrequency: {value: new THREE.Vector2(10.0, 3.0)},
        uTime: {value: 0.0},
        uTexture: {value: texture},
    },
});

gui.add(material.uniforms.uFrequency.value, 'x').min(0.0).max(40.0)
gui.add(material.uniforms.uFrequency.value, 'y').min(0.0).max(40.0)

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, -0.25, 1)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

console.log(geometry.attributes)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()