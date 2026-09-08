'use client'
import { Suspense, useEffect, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MathUtils, PMREMGenerator, type Group } from 'three'

export interface MotionState {
  progress: number
  x: number
  y: number
}
function Token({
  motion,
  onReady,
}: {
  motion: RefObject<MotionState>
  onReady: () => void
}) {
  const gltf = useLoader(GLTFLoader, '/models/hero-casino-token.glb')
  const group = useRef<Group>(null)
  const time = useRef(0)
  const { gl, scene } = useThree()
  useEffect(() => {
    const environment = new RoomEnvironment()
    const generator = new PMREMGenerator(gl)
    const target = generator.fromScene(environment, 0.04)
    scene.environment = target.texture
    scene.environmentIntensity = 0.75
    onReady()
    return () => {
      scene.environment = null
      target.dispose()
      environment.dispose()
      generator.dispose()
    }
  }, [gl, scene, onReady])
  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    time.current += dt
    const m = motion.current
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      Math.PI / 2 + 0.16 + (m.y * Math.PI) / 45,
      4,
      dt,
    )
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      -0.38 +
        (m.x * 7 * Math.PI) / 180 +
        m.progress * 2.5 +
        Math.sin(time.current * 0.24) * 0.06,
      4,
      dt,
    )
    group.current.rotation.z = -0.14 + Math.sin(time.current * 0.18) * 0.025
    group.current.position.y = Math.sin(time.current * 0.6) * 0.035
  })
  return (
    <group ref={group} rotation={[Math.PI / 2 + 0.16, -0.38, -0.14]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default function HeroScene({
  active,
  mobile,
  motion,
  onReady,
  onError,
}: {
  active: boolean
  mobile: boolean
  motion: RefObject<MotionState>
  onReady: () => void
  onError: () => void
}) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 5.5], fov: 37 }}
      dpr={mobile ? 1 : [1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onError, {
          once: true,
        })
      }}
      fallback={null}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 5]} intensity={3} color="#ffecd1" />
      <directionalLight position={[3, 0, 3]} intensity={2} color="#e0d9ff" />
      <Suspense fallback={null}>
        <Token motion={motion} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
