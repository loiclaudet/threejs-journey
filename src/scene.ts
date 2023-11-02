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

  const textureLoader = new THREE.TextureLoader()
  // const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg")
  const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  gui.add(ambientLight, "intensity").min(0).max(2).step(0.001)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(2, 2, -1)
  directionalLight.castShadow = false
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024

  // shadow camera for directional light is an orthographic camera
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 6
  // reducing the amplitude provide a better shadow result
  directionalLight.shadow.camera.top = 2
  directionalLight.shadow.camera.right = 2
  directionalLight.shadow.camera.bottom = -2
  directionalLight.shadow.camera.left = -2
  // directionalLight.shadow.radius = 10
  scene.add(directionalLight)

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  )
  directionalLightCameraHelper.visible = false
  scene.add(directionalLightCameraHelper)

  gui.add(directionalLight, "intensity").min(0).max(4).step(0.001)
  gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
  gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
  gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)

  // Spot light
  const spotLight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI / 3)
  spotLight.castShadow = false
  spotLight.position.set(0, 2, 2)
  scene.add(spotLight, spotLight.target)
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  // shadow camera for directional light is a perspective camera
  spotLight.shadow.camera.fov = 30
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 6

  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
  spotLightCameraHelper.visible = false
  scene.add(spotLightCameraHelper)

  // Point light
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(-1, 1, 0)
  pointLight.castShadow = false
  pointLight.shadow.mapSize.width = 1024
  pointLight.shadow.mapSize.height = 1024
  pointLight.shadow.camera.near = 0.1
  pointLight.shadow.camera.far = 5
  scene.add(pointLight)

  const pointLightCameraHelper = new THREE.CameraHelper(
    pointLight.shadow.camera
  )
  pointLightCameraHelper.visible = false
  scene.add(pointLightCameraHelper)

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
  sphere.castShadow = false

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
      // map: bakedShadow,
    })
  )
  plane.receiveShadow = true
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.5

  scene.add(sphere, plane)

  const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: simpleShadow,
      transparent: true,
    })
  )
  sphereShadow.rotation.x = -Math.PI / 2
  sphereShadow.position.y = plane.position.y + 0.01
  scene.add(sphereShadow)

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
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  renderer.render(scene, camera)

  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = 1 - sphere.position.y * 0.5

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
