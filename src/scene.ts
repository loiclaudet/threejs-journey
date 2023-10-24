import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  const scene = new THREE.Scene()

  const sizes = {
    width: Math.min(800, window.innerWidth),
    height: Math.min(600, window.innerWidth, window.innerHeight),
  }

  const cursor = {
    x: 0,
    y: 0,
  }

  window.addEventListener("mousemove", (event: MouseEvent) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
  })

  // Objects
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  scene.add(cube)

  // helper
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )

  camera.position.z = 3
  camera.lookAt(cube.position)

  scene.add(camera)

  const controls = new OrbitControls(camera, canvasElement)
  controls.enableDamping = true
  controls.update()

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)

  window.addEventListener("resize", () => {
    sizes.width = Math.min(800, window.innerWidth)
    sizes.height = Math.min(600, window.innerHeight)
    renderer.setSize(sizes.width, sizes.height)
  })

  const tick = () => {
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
