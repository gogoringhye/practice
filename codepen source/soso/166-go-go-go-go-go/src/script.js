import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import RAPIER from '@dimforge/rapier3d-compat'

const go_radius = 0.1

const batchedmeshes = Array(2) //1b1w
const batch_sizes = [(19 * 19) / 2, undefined] //n geoms
batch_sizes[1] = Number.isInteger(batch_sizes[0])
  ? batch_sizes[0]
  : 1 + (batch_sizes[0] |= 0)

const mats = [
  new THREE.MeshPhysicalMaterial({ color: 'black', clearcoat: 1, roughness: 1 }),
  new THREE.MeshPhysicalMaterial({ 
    color: 'white', clearcoat: 1, roughness: 1,
    transparent: true, opacity: 0.5,
    side: THREE.DoubleSide, shadowSide: THREE.BackSide
  })
]

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer({ antialias: true })
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('gray')
scene.fog = new THREE.FogExp2('gray', 0.1)
camera.position.set(3, 2, 3)
controls.enableDamping = true
renderer.shadowMap.enabled = true

const light = new THREE.DirectionalLight('white', Math.PI)
light.position.set(4, 4, 4)
light.castShadow = true
light.shadow.mapSize.setScalar(2048)
scene.add(light)
scene.add(new THREE.HemisphereLight('lightblue', 'tan', Math.PI))

async function main() {
  await RAPIER.init()
  
  const board_size = new THREE.Vector3()
  board_size.x = board_size.z = (19 + 1) * go_radius * 2
  board_size.y = 0.5
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(...board_size),
    new THREE.MeshPhysicalMaterial({ roughness: 1, color: 'brown' }),
  )
  board.castShadow = board.receiveShadow = true
  board.matrixAutoUpdate = false
  scene.add(board)

  const grid = new THREE.GridHelper((19 - 1) * go_radius * 2, 19 - 1, 'black', 'black')
  grid.position.y = board_size.y * 0.5 + 0.001
  board.add(grid)

  // phys world
  const r_world = new RAPIER.World(new THREE.Vector3(0, -9.8, 0))

  // phys body: board
  const r_body_board = r_world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased(),
  )
  const half = board_size.clone().multiplyScalar(0.5)
  r_world.createCollider(RAPIER.ColliderDesc.cuboid(...half), r_body_board)

  // create geoms
  const geoms = new Map()
  geoms.set('go', new THREE.SphereGeometry(go_radius, 32, 16).scale(0.9, 0.9 / 3, 0.9))
  geoms.set('go-lowpoly', new THREE.SphereGeometry(go_radius, 8, 6).scale(1, 1 / 3, 1))

  // new batchedmesh(es)
  for (let i = 0; i < batchedmeshes.length; ++i) {
    const max_geoms = batch_sizes[i]
    const max_verts = batch_sizes[i] * geoms.get('go').getAttribute('position').count
    const max_indices = batch_sizes[i] * geoms.get('go').index.count
    const bm = new THREE.BatchedMesh(max_geoms, max_verts, max_indices, mats[i])
    bm.castShadow = bm.receiveShadow = true
    bm.frustumCulled = false // default is true
    bm.perObjectFrustumCulled = true // default is true
    scene.add(bm)
    batchedmeshes[i] = bm
  }

  // add geom; add phys body
  const r_body_meta = new Map() // <physbody, {batchedmesh,gid}>
  const _q = new THREE.Quaternion()
  const _p = new THREE.Vector3()
  const _m = new THREE.Matrix4()
  const _e = new THREE.Euler()
  let k = 0
  for (const bm of batchedmeshes) {
    for (let i = 0; i < bm.maxGeometryCount; ++i) {

      // add geom
      const geom = geoms.get('go')
      const gid = bm.addGeometry(geom)

      // add phys body
      const r_body = r_world.createRigidBody(RAPIER.RigidBodyDesc.dynamic())
      _p.y = 0.5
      _p.x = (-19 * go_radius) + (k / 19 | 0) * go_radius * 2 + go_radius
      _p.z = (-19 * go_radius) + (k % 19) * go_radius * 2 + go_radius
      r_body.setTranslation(_p, true)
      k += 1
      const collider_desc = RAPIER.ColliderDesc.convexHull(
        geoms.get('go-lowpoly').getAttribute('position').array,
      )
      if (collider_desc) {
        collider_desc.setMass(0.1).setFriction(0).setRestitution(0.6)
        r_world.createCollider(collider_desc, r_body)
      } else throw alert('failed to gen convex hull collider')

      // set meta
      r_body_meta.set(r_body, { bm, gid })
    }
  }

  // decl phys frame
  let t = 0
  scene.userData.phys_frame = (dt) => {
    // phys adv
    r_world.timestep = dt
    r_world.step()
    // phys sync
    for (const [r_body, { bm, gid }] of r_body_meta.entries()) {
      _p.copy(r_body.translation())
      _q.copy(r_body.rotation())
      _m.makeRotationFromQuaternion(_q).setPosition(_p)
      bm.setMatrixAt(gid, _m)
      if (_p.y < -2) {
        // teleport; keep rot
        r_body.resetForces()
        r_body.resetTorques()
        r_body.setLinvel({x:0,y:0,z:0},true)
        r_body.setAngvel({x:0,y:0,z:0},true)
        r_body.setTranslation({
          x: (Math.random() - 0.5) * board_size.x / 3,
          z: (Math.random() - 0.5) * board_size.z / 3,
          y: 0.5
        })
      } 
    }

    _p.copy(r_body_board.translation())
    _q.copy(r_body_board.rotation())
    board.matrix.makeRotationFromQuaternion(_q).setPosition(_p)
    
    // prepare next phys frame
    _e.set(0, 0, Math.min(0.1, Math.max(-0.1, Math.sin(t*4) * Math.PI /10)))
    _e.x = _e.z * 2
    r_body_board.setNextKinematicRotation(_q.setFromEuler(_e))
    r_body_board.setNextKinematicTranslation({ x: _e.z, y: 0, z: _e.z })

    t += dt
  }

  setTimeout(() => {
    phys_enabled = 0
    window.onkeydown = e => e.code === 'KeyA' && (phys_enabled ^= 1)
    el_toggle.onclick = () => phys_enabled ^= 1
  }, 2000)
}
main()

//

let phys_enabled = 1
const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
  phys_enabled && scene.userData.phys_frame?.(Math.min(1 / 60, clock.getDelta()))
  controls.autoRotate = !phys_enabled
  renderer.render(scene, camera)
  controls.update()
})


//

window.addEventListener('resize', () => {
  const { clientWidth, clientHeight } = renderer.domElement
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(clientWidth, clientHeight, false)
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
})
document.body.prepend(renderer.domElement)
window.dispatchEvent(new Event('resize'))
