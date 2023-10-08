import * as THREE from "three"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  const scene = new THREE.Scene()

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  scene.add(mesh)

  const sizes = {
    width: window.innerWidth,
    height: Math.min(window.innerHeight, window.innerWidth),
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 5
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = Math.min(window.innerHeight, window.innerWidth)
    renderer.setSize(sizes.width, sizes.height)
  })
}
