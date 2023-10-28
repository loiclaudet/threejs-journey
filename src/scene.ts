import * as THREE from "three"
// import gsap from "gsap"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"

THREE.ColorManagement.enabled = false

// Debug
const gui = new GUI()

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
)
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

const gradient3Texture = textureLoader.load("/textures/gradients/3.jpg")
const matcaps1Texture = textureLoader.load("/textures/matcaps/1.png")

// const environmentMap = cubeTextureLoader
//   .setPath("/textures/environmentMaps/")
//   .load([
//     "0/px.jpg",
//     "0/nx.jpg",
//     "0/py.jpg",
//     "0/ny.jpg",
//     "0/pz.jpg",
//     "0/nz.jpg",
//   ])

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const cursor = {
    x: 0,
    y: 0,
  }

  window.addEventListener("mousemove", (event: MouseEvent) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
  })

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  window.addEventListener("dblclick", () => {
    // Toggle fullscreen
    document.fullscreenElement
      ? document.exitFullscreen()
      : canvasElement.requestFullscreen()
  })

  // helper
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambientLight)

  const light = new THREE.PointLight(0xffffff, 4)
  light.position.x = 2
  light.position.y = 3
  light.position.z = 4
  scene.add(light)

  // Meshes
  // const material = new THREE.MeshBasicMaterial()
  // material.map = doorColorTexture
  // material.transparent = true
  // material.alphaMap = doorAlphaTexture
  // material.side = THREE.DoubleSide

  // const material = new THREE.MeshNormalMaterial()
  // material.flatShading = true

  // const material = new THREE.MeshMatcapMaterial({ matcap: matcaps1Texture })

  // const material = new THREE.MeshDepthMaterial()

  // const material = new THREE.MeshLambertMaterial()

  // const material = new THREE.MeshPhongMaterial()
  // material.shininess = 50
  // material.specular = new THREE.Color(0x00ff00)

  // const material = new THREE.MeshToonMaterial()
  // material.gradientMap = gradient3Texture
  // gradient3Texture.minFilter = THREE.NearestFilter
  // gradient3Texture.magFilter = THREE.NearestFilter
  // gradient3Texture.generateMipmaps = false

  const material = new THREE.MeshStandardMaterial()
  material.metalness = 0
  material.roughness = 1
  material.map = doorColorTexture
  material.aoMap = doorAmbientOcclusionTexture
  material.aoMapIntensity = 1
  material.displacementMap = doorHeightTexture
  material.displacementScale = 0.05
  material.metalnessMap = doorMetalnessTexture
  material.roughnessMap = doorRoughnessTexture
  material.normalMap = doorNormalTexture
  material.normalScale.set(0.5, 0.5)
  material.transparent = true
  material.alphaMap = doorAlphaTexture

  // const material = new THREE.MeshStandardMaterial()
  // material.metalness = 0.7
  // material.roughness = 0.2
  // material.envMap = environmentMap

  gui.add(material, "metalness").min(0).max(1).step(0.0001)
  gui.add(material, "roughness").min(0).max(1).step(0.0001)
  gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001)
  gui.add(material, "displacementScale").min(0).max(1).step(0.0001)

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material)
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
  )

  sphere.position.x = -1.5
  torus.position.x = 1.5
  scene.add(sphere, torus, plane)

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvasElement)
  controls.enableDamping = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  renderer.render(scene, camera)

  // Animate
  // const clock = new THREE.Clock()

  const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // sphere.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
