import * as THREE from "three"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  const scene = new THREE.Scene()

  // Objects
  const group = new THREE.Group()
  group.position.y = 1
  scene.add(group)

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  group.add(cube1)

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  )
  cube2.position.x = -2
  group.add(cube2)

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  )
  cube3.position.x = 2
  group.add(cube3)

  const sizes = {
    width: Math.min(800, window.innerWidth),
    height: Math.min(600, window.innerHeight, window.innerWidth),
  }

  // helper
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  // camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 5
  scene.add(camera)

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)

  window.addEventListener("resize", () => {
    sizes.width = Math.min(800, window.innerWidth)
    sizes.height = Math.min(600, window.innerHeight, window.innerWidth)
    renderer.setSize(sizes.width, sizes.height)
  })
}
