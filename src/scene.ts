import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

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
    document.fullscreenElement
      ? document.exitFullscreen()
      : canvasElement.requestFullscreen()
  })

  // Objects

  const geometry = new THREE.BufferGeometry()
  const count = 100
  const vertices = new Float32Array(count * 3 * 3)
  for (let i = 0; i < count * 3 * 3; i++) {
    vertices[i] = Math.random() - 0.5
  }
  const positionAttribute = new THREE.BufferAttribute(vertices, 3)
  geometry.setAttribute("position", positionAttribute)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // helper
  // const axesHelper = new THREE.AxesHelper()
  // scene.add(axesHelper)

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )

  camera.position.z = 3
  camera.lookAt(mesh.position)

  scene.add(camera)

  const controls = new OrbitControls(camera, canvasElement)
  controls.enableDamping = true

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
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
