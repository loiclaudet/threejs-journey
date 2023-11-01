import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
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

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  gui.add(ambientLight, "intensity").min(0).max(2).step(0.001)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(2, 2, -1)
  gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
  gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
  gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
  gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)
  scene.add(directionalLight)

  /**
   * Materials
   */
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7
  gui.add(material, "metalness").min(0).max(1).step(0.001)
  gui.add(material, "roughness").min(0).max(1).step(0.001)

  /**
   * Objects
   */
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.5

  scene.add(sphere, plane)

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

  const tick = () => {
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
