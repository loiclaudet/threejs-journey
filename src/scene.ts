import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import * as dat from "lil-gui"

export const setupScene = (canvasElement: HTMLCanvasElement) => {
  THREE.ColorManagement.enabled = false

  //Debug
  const gui = new dat.GUI()

  const scene = new THREE.Scene()

  const fogColor = "#262837"
  const fog = new THREE.Fog(fogColor, 1, 15)
  scene.fog = fog

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setPath("/textures")
  const bricksColorTexture = textureLoader.load("/bricks/color.jpg")
  const bricksAOTexture = textureLoader.load("/bricks/ambientOcclusion.jpg")
  const bricksNormalTexture = textureLoader.load("/bricks/normal.jpg")
  const bricksRoughnessTexture = textureLoader.load("/bricks/roughness.jpg")

  bricksColorTexture.colorSpace = THREE.SRGBColorSpace

  bricksColorTexture.repeat.set(0.5, 0.5)
  bricksAOTexture.repeat.set(0.5, 0.5)
  bricksNormalTexture.repeat.set(0.5, 0.5)
  bricksRoughnessTexture.repeat.set(0.5, 0.5)

  bricksColorTexture.wrapS = THREE.RepeatWrapping
  bricksAOTexture.wrapS = THREE.RepeatWrapping
  bricksNormalTexture.wrapS = THREE.RepeatWrapping
  bricksRoughnessTexture.wrapS = THREE.RepeatWrapping

  bricksColorTexture.wrapT = THREE.RepeatWrapping
  bricksAOTexture.wrapT = THREE.RepeatWrapping
  bricksNormalTexture.wrapT = THREE.RepeatWrapping
  bricksRoughnessTexture.wrapT = THREE.RepeatWrapping

  const doorAlphaTexture = textureLoader.load("/door/alpha.jpg")
  const doorColorTexture = textureLoader.load("/door/color.jpg")
  const doorAOTexture = textureLoader.load("/door/ambientOcclusion.jpg")
  const doorHeightTexture = textureLoader.load("/door/height.jpg")
  const doorNormalTexture = textureLoader.load("/door/normal.jpg")
  const doorRoughnessTexture = textureLoader.load("/door/roughness.jpg")
  const doorMetalnessTexture = textureLoader.load("/door/metalness.jpg")

  doorColorTexture.colorSpace = THREE.SRGBColorSpace

  const grassColorTexture = textureLoader.load("/grass/color.jpg")
  const grassAOTexture = textureLoader.load("/grass/ambientOcclusion.jpg")
  const grassNormalTexture = textureLoader.load("/grass/normal.jpg")
  const grassRoughnessTexture = textureLoader.load("/grass/roughness.jpg")

  grassColorTexture.colorSpace = THREE.SRGBColorSpace

  grassColorTexture.repeat.set(8, 8)
  grassAOTexture.repeat.set(8, 8)
  grassNormalTexture.repeat.set(8, 8)
  grassRoughnessTexture.repeat.set(8, 8)

  grassColorTexture.wrapS = THREE.RepeatWrapping
  grassAOTexture.wrapS = THREE.RepeatWrapping
  grassNormalTexture.wrapS = THREE.RepeatWrapping
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping

  grassColorTexture.wrapT = THREE.RepeatWrapping
  grassAOTexture.wrapT = THREE.RepeatWrapping
  grassNormalTexture.wrapT = THREE.RepeatWrapping
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping

  // Floor
  const floorSize = 20
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAOTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  )
  floor.rotation.x = -Math.PI * 0.5
  floor.position.y = 0
  scene.add(floor)

  const house = new THREE.Group()
  scene.add(house)

  const wallsHeight = 2.5
  const wallsWidth = 4
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallsWidth, 2.5, wallsWidth),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      roughnessMap: bricksRoughnessTexture,
      aoMap: bricksAOTexture,
      normalMap: bricksNormalTexture,
    })
  )
  walls.position.y += wallsHeight * 0.5

  const roofHeight = 1
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(wallsWidth, roofHeight, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
  )
  roof.position.y += wallsHeight + roofHeight * 0.5
  roof.rotation.y = Math.PI * 0.25

  const doorHeight = 2
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, doorHeight),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAOTexture,
      normalMap: doorNormalTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  )
  door.position.z += wallsWidth * 0.5 + 0.01
  door.position.y += doorHeight * 0.5 - 0.1

  const bushMaterial = new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAOTexture,
  })
  const bushRadius = 0.5

  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(bushRadius),
    bushMaterial
  )
  bush.position.x = wallsWidth * 0.2
  bush.position.z += wallsWidth * 0.5 + bushRadius * 0.8
  bush.position.y += bushRadius * bushRadius

  const bush2Radius = 0.25
  const bush2 = new THREE.Mesh(
    new THREE.SphereGeometry(bush2Radius),
    bushMaterial
  )
  bush2.position.x = wallsWidth * 0.35
  bush2.position.z += wallsWidth * 0.5 + bush2Radius * 0.8
  bush2.position.y += bush2Radius * bush2Radius

  const bush3Radius = 0.35
  const bush3 = new THREE.Mesh(
    new THREE.SphereGeometry(bush3Radius),
    bushMaterial
  )
  bush3.position.x -= wallsWidth * 0.2
  bush3.position.z += wallsWidth * 0.5 + bush3Radius * 0.8
  bush3.position.y += bush3Radius * bush3Radius

  const bush4Radius = 0.15
  const bush4 = new THREE.Mesh(
    new THREE.SphereGeometry(bush4Radius),
    bushMaterial
  )
  bush4.position.x -= wallsWidth * 0.25
  bush4.position.z += wallsWidth * 0.5 + bush4Radius * 4
  bush4.position.y += bush4Radius * bush4Radius

  house.add(walls, roof, door, bush, bush2, bush3, bush4)

  const graveyard = new THREE.Group()
  scene.add(graveyard)

  const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })
  const graveWidth = 0.6
  const graveHeight = 0.8
  const graveGeometry = new THREE.BoxGeometry(graveWidth, graveHeight, 0.2)

  new Array(50).fill(null).forEach(() => {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const graveRotationAngle = Math.PI * 0.05
    grave.position.y +=
      graveHeight * 0.5 - Math.sin(graveRotationAngle) * graveWidth

    const angle = Math.random() * Math.PI * 2
    const radius = randomBetween(wallsWidth, floorSize * 0.5)
    grave.position.x = Math.sin(angle) * radius
    grave.position.z = Math.cos(angle) * radius
    grave.rotation.z = randomBetween(-graveRotationAngle, graveRotationAngle)
    grave.castShadow = true
    graveyard.add(grave)
  })

  function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.1)
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
  scene.add(ambientLight)

  // Directional light
  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.24)
  moonLight.position.set(4, 5, -2)
  gui.add(moonLight, "intensity").min(0).max(1).step(0.001)
  gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
  gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
  gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
  scene.add(moonLight)

  // Door light
  const doorLight = new THREE.PointLight("#ff7d46", 9, 7)
  doorLight.position.z += wallsWidth * 0.5 + 1.5
  doorLight.position.y += doorHeight
  house.add(doorLight)

  gui.add(doorLight, "intensity").min(0).max(10)

  // Ghosts
  const ghost = new THREE.PointLight("#ff00ff", 6, 3)
  const ghost2 = new THREE.PointLight("#00ffff", 6, 3)
  const ghost3 = new THREE.PointLight("#ffff00", 6, 3)
  scene.add(ghost, ghost2, ghost3)

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

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

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.x = 2
  camera.position.y = 3
  camera.position.z = 8
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvasElement)
  controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(fogColor)
  renderer.shadowMap.enabled = true

  moonLight.castShadow = true

  doorLight.castShadow = true
  doorLight.shadow.mapSize.width = 256
  doorLight.shadow.mapSize.height = 256
  doorLight.shadow.camera.far = 7

  ghost.castShadow = true
  ghost.shadow.mapSize.width = 256
  ghost.shadow.mapSize.height = 256
  ghost.shadow.camera.far = 7

  ghost2.castShadow = true
  ghost2.shadow.mapSize.width = 256
  ghost2.shadow.mapSize.height = 256
  ghost2.shadow.camera.far = 7

  ghost3.castShadow = true
  ghost3.shadow.mapSize.width = 256
  ghost3.shadow.mapSize.height = 256
  ghost3.shadow.camera.far = 7

  bush.castShadow = true
  bush2.castShadow = true
  bush3.castShadow = true
  bush4.castShadow = true
  walls.castShadow = true

  floor.receiveShadow = true

  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
   * Animate
   */
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const ghostAngle = elapsedTime * 0.2
    ghost.position.x = Math.cos(ghostAngle) * 4
    ghost.position.z = Math.sin(ghostAngle) * 4
    ghost.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}
