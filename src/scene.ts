import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  THREE.ColorManagement.enabled = false

  const scene = new THREE.Scene()

  const textureLoader = new THREE.TextureLoader()
  textureLoader.setPath("/textures")

  const matcap5Texture = textureLoader.load("/matcaps/5.png")
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcap5Texture,
  })

  const fontLoader = new FontLoader()
  fontLoader
    .setPath("/fonts")
    .load("/helvetiker_regular.typeface.json", (font) => {
      const bevelSize = 0.02
      const bevelThickness = 0.03

      const textGeometry = new TextGeometry("Hello!", {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness,
        bevelSize,
        bevelOffset: 0,
        bevelSegments: 4,
      })

      // textGeometry.computeBoundingBox()

      // if (textGeometry.boundingBox) {
      //   textGeometry.translate(
      //     -(textGeometry.boundingBox?.max.x - bevelSize) * 0.5,
      //     -(textGeometry.boundingBox?.max.y - bevelSize) * 0.5,
      //     -(textGeometry.boundingBox?.max.z - bevelThickness) * 0.5
      //   )
      // }
      textGeometry.center()

      const text = new THREE.Mesh(textGeometry, material)
      text.name = "hello"

      scene.add(text)
    })

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.1)

  for (let i = 0; i < 300; i++) {
    const torus = new THREE.Mesh(torusGeometry, material)
    const torusScale = Math.max(Math.random(), 0.1)
    torus
      .translateX((Math.random() - 0.5) * 10)
      .translateY((Math.random() - 0.5) * 10)
      .translateZ((Math.random() - 0.5) * 10)
      .rotateX(Math.PI * Math.random())
      .rotateY(Math.PI * Math.random())
      .scale.set(torusScale, torusScale, torusScale)

    scene.add(torus)
  }

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

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 5

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
