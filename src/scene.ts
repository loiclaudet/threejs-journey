import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js"
import * as dat from "lil-gui"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  THREE.ColorManagement.enabled = false

  //Debug
  const gui = new dat.GUI()

  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const cursor = {
    x: 0,
    y: 0,
  }

  // Material
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.2

  // Objects
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
  sphere.position.x = -1.5

  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
  )
  torus.position.x = 1.5

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.65

  scene.add(sphere, cube, torus, plane)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1) // low perf cost
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.6) // moderate perf cost
  directionalLight.position.set(2, 0.5, 0)
  scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1) // low perf cost
  scene.add(hemisphereLight)

  const pointLight = new THREE.PointLight(0xff5000, 1, 10, 2) // moderate perf cost
  pointLight.position.set(1, 0, 1)
  scene.add(pointLight)

  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1) // high perf cost
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt(new THREE.Vector3())
  scene.add(rectAreaLight)

  const spotLight = new THREE.SpotLight( // high perf cost
    0x78ff00,
    1,
    9,
    Math.PI * 0.1,
    0.25,
    0.5
  )
  spotLight.position.set(0, 1, 3)
  scene.add(spotLight)
  spotLight.target.position.x = -0.8
  scene.add(spotLight.target)

  // GUI Debug / controls
  const lightsFolder = gui.addFolder("Lights").close()
  const ambientFolder = lightsFolder.addFolder("Ambient").close()
  ambientFolder
    .add(ambientLight, "intensity")
    .min(0)
    .max(2)
    .step(0.01)
    .name("intensity")

  const directionalFolder = lightsFolder.addFolder("Directional").close()
  directionalFolder
    .add(directionalLight, "intensity")
    .min(0)
    .max(2)
    .step(0.01)
    .name("intensity")

  const directionalPositionFolder = directionalFolder.addFolder("position")
  directionalPositionFolder
    .add(directionalLight.position, "x")
    .min(-1)
    .max(1)
    .step(0.1)
    .name("x")
  directionalPositionFolder
    .add(directionalLight.position, "y")
    .min(0)
    .max(1)
    .step(0.1)
    .name("y")

  const hemisphereFolder = lightsFolder.addFolder("Hemisphere").close()
  hemisphereFolder.add(hemisphereLight, "intensity").min(0).max(2).step(0.01)

  const pointFolder = lightsFolder.addFolder("Point").close()
  pointFolder.add(pointLight, "intensity").min(0).max(2).step(0.01)
  pointFolder.add(pointLight, "distance").min(0.01).max(10).step(0.01)
  pointFolder.add(pointLight, "decay").min(0).max(5).step(0.01)
  const pointPositionFolder = pointFolder.addFolder("position")
  pointPositionFolder
    .add(pointLight.position, "x")
    .min(-1)
    .max(1)
    .step(0.1)
    .name("x")
  pointPositionFolder
    .add(pointLight.position, "y")
    .min(-0.5)
    .max(1)
    .step(0.1)
    .name("y")
  pointPositionFolder
    .add(pointLight.position, "z")
    .min(-1)
    .max(1)
    .step(0.1)
    .name("z")

  const rectAreaFolder = lightsFolder.addFolder("RectArea").close()
  rectAreaFolder.add(rectAreaLight, "intensity").min(0).max(4).step(0.01)
  rectAreaFolder.add(rectAreaLight, "width").min(0).max(10).step(0.01)
  rectAreaFolder.add(rectAreaLight, "height").min(0).max(10).step(0.01)
  const rectAreaPositionFolder = rectAreaFolder.addFolder("position")
  rectAreaPositionFolder
    .add(rectAreaLight.position, "x")
    .min(-2)
    .max(2)
    .step(0.1)
    .name("x")
  rectAreaPositionFolder
    .add(rectAreaLight.position, "y")
    .min(-2)
    .max(2)
    .step(0.1)
    .name("y")
  rectAreaPositionFolder
    .add(rectAreaLight.position, "z")
    .min(-2)
    .max(2)
    .step(0.1)
    .name("z")

  const spotFolder = lightsFolder.addFolder("Spot").close()
  spotFolder.add(spotLight, "intensity").min(0).max(4).step(0.01)
  spotFolder.add(spotLight, "distance").min(0.01).max(10).step(0.01)
  spotFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01)
  spotFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01)
  spotFolder.add(spotLight, "decay").min(0).max(2).step(0.01)
  const spotTargetFolder = spotFolder.addFolder("target")
  const spotTargetPositionFolder = spotTargetFolder.addFolder("position")
  spotTargetPositionFolder
    .add(spotLight.target.position, "x")
    .min(-2)
    .max(2)
    .step(0.01)
  spotTargetPositionFolder
    .add(spotLight.target.position, "z")
    .min(-2)
    .max(2)
    .step(0.01)

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

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 4
  scene.add(camera)

  // Helpers
  const helper = new THREE.AxesHelper()
  scene.add(helper)

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2
  )
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    0.2
  )
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(
    directionalLightHelper,
    hemisphereLightHelper,
    pointLightHelper,
    spotLightHelper
  )

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
  rectAreaLight.add(rectAreaLightHelper)

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

  const tick = () => {
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
