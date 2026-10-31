import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type GalaxyBackgroundProps = {
  onReady: () => void;
};

type QualityProfile = {
  dpr: number;
  stars: number;
  flightStars: number;
  galaxyStars: number;
  dust: number;
  clouds: number;
  constellationClusters: number;
  bloomStrength: number;
  frameInterval: number;
};

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

type CloudMotion = {
  sprite: THREE.Sprite;
  speed: number;
  driftX: number;
  phase: number;
};

function getQualityProfile(): QualityProfile {
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory || 4;
  const dpr = window.devicePixelRatio || 1;

  if (mobile || cores <= 4 || memory <= 4) {
    return {
      dpr: Math.min(dpr, 1.15),
      stars: 260,
      flightStars: 580,
      galaxyStars: 800,
      dust: 100,
      clouds: 1,
      constellationClusters: 10,
      bloomStrength: 0.38,
      frameInterval: 1000 / 40,
    };
  }

  if (cores <= 8 || memory <= 8) {
    return {
      dpr: Math.min(dpr, 1.5),
      stars: 400,
      flightStars: 1100,
      galaxyStars: 1650,
      dust: 220,
      clouds: 2,
      constellationClusters: 18,
      bloomStrength: 0.5,
      frameInterval: 1000 / 55,
    };
  }

  return {
    dpr: Math.min(dpr, 1.8),
    stars: 600,
    flightStars: 1800,
    galaxyStars: 2600,
    dust: 430,
    clouds: 3,
    constellationClusters: 26,
    bloomStrength: 0.62,
    frameInterval: 1000 / 60,
  };
}

function createStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(0.12, "rgba(255,255,255,0.98)");
    glow.addColorStop(0.38, "rgba(210,231,255,0.58)");
    glow.addColorStop(1, "rgba(170,210,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, 128, 128);
    context.filter = "blur(9px)";
    const wisps = [
      { x: 47, y: 62, radius: 42, alpha: 0.34 },
      { x: 76, y: 55, radius: 34, alpha: 0.27 },
      { x: 65, y: 81, radius: 29, alpha: 0.2 },
    ];
    wisps.forEach(({ x, y, radius, alpha }) => {
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(150,180,210,${alpha})`);
      glow.addColorStop(0.45, `rgba(80,115,155,${alpha * 0.6})`);
      glow.addColorStop(1, "rgba(20,40,70,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, 128, 128);
    });
    context.filter = "none";
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createStarField(
  count: number,
  radius: number,
  starTexture: THREE.Texture,
): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cool = new THREE.Color("#dceeff");
  const warm = new THREE.Color("#fff7e8");
  const violet = new THREE.Color("#b7c6ff");

  for (let index = 0; index < count; index += 1) {
    const distance = radius * (0.45 + Math.random() * 0.55);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const positionIndex = index * 3;
    positions[positionIndex] = distance * Math.sin(phi) * Math.cos(theta);
    positions[positionIndex + 1] = distance * Math.cos(phi);
    positions[positionIndex + 2] =
      distance * Math.sin(phi) * Math.sin(theta) - radius * 0.22;

    const color = cool
      .clone()
      .lerp(Math.random() > 0.72 ? warm : violet, Math.random() * 0.7);
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    map: starTexture,
    size: 0.22,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.28,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createFlightStars(
  count: number,
): THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  const palette = [
    new THREE.Color("#eef9ff"),
    new THREE.Color("#dff6ff"),
    new THREE.Color("#f8fbff"),
    new THREE.Color("#8fe9ff"),
    new THREE.Color("#b9a7ff"),
    new THREE.Color("#ffe7ba"),
  ];
  const aspect = Math.max(0.7, window.innerWidth / window.innerHeight);

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    const depth = Math.random();
    const color = palette[Math.floor(Math.random() * palette.length)];
    positions[positionIndex] =
      (Math.random() - 0.5) * (40 + Math.min(aspect, 1.8) * 16);
    positions[positionIndex + 1] = (Math.random() - 0.5) * 38;
    positions[positionIndex + 2] = -62 + depth * 68;
    colors[positionIndex] = color?.r ?? 1;
    colors[positionIndex + 1] = color?.g ?? 1;
    colors[positionIndex + 2] = color?.b ?? 1;
    sizes[index] = 0.95 + Math.random() * 2;
    speeds[index] = 5.5 + Math.random() * 11.5;
    phases[index] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      precision highp float;
      attribute float aSize;
      attribute float aSpeed;
      attribute float aPhase;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vBrightness;

      void main() {
        vec3 animated = position;
        animated.z = mod(position.z + uTime * aSpeed + 62.0, 68.0) - 62.0;
        vec4 viewPosition = modelViewMatrix * vec4(animated, 1.0);
        float viewDepth = max(1.0, -viewPosition.z);
        float twinkle = 0.78 + 0.22 * sin(uTime * 2.3 + aPhase);
        float nearGlow = 1.0 - smoothstep(18.0, 72.0, viewDepth);
        vAlpha = min(1.05, twinkle * (0.68 + nearGlow * 0.4));
        vBrightness = 1.18 + nearGlow * 0.4;
        vColor = color;
        gl_PointSize = clamp(aSize * (98.0 / viewDepth), 1.35, 11.5);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vBrightness;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float distanceToCore = length(point);
        float core = smoothstep(0.42, 0.02, distanceToCore);
        float verticalRay =
          smoothstep(0.075, 0.0, abs(point.x)) *
          smoothstep(0.5, 0.06, abs(point.y));
        float horizontalRay =
          smoothstep(0.075, 0.0, abs(point.y)) *
          smoothstep(0.5, 0.06, abs(point.x));
        float sparkle = max(core, max(verticalRay, horizontalRay) * 0.82);
        float alpha = sparkle * vAlpha;
        if (alpha < 0.025) discard;
        gl_FragColor = vec4(vColor * vBrightness, alpha);
      }
    `,
  });

  const stars = new THREE.Points(geometry, material);
  stars.renderOrder = 6;
  return stars;
}

function createSpiralGalaxy(
  count: number,
  starTexture: THREE.Texture,
): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const core = new THREE.Color("#f7fbff");
  const middle = new THREE.Color("#c7d0db");
  const edge = new THREE.Color("#6f8299");
  const arms = 5;

  for (let index = 0; index < count; index += 1) {
    const radiusRatio = Math.pow(Math.random(), 0.64);
    const radius = radiusRatio * 24;
    const arm = index % arms;
    const branchAngle = (arm / arms) * Math.PI * 2;
    const spin = radius * 0.43;
    const scatter = (1 - radiusRatio * 0.52) * 2.1;
    const angle = branchAngle + spin + (Math.random() - 0.5) * scatter;
    const positionIndex = index * 3;

    positions[positionIndex] =
      Math.cos(angle) * radius + (Math.random() - 0.5) * 1.3;
    positions[positionIndex + 1] =
      (Math.random() - 0.5) * (0.5 + radiusRatio * 2.6);
    positions[positionIndex + 2] =
      Math.sin(angle) * radius + (Math.random() - 0.5) * 1.3 - 12;

    const color =
      radiusRatio < 0.28
        ? core.clone().lerp(middle, radiusRatio / 0.28)
        : middle.clone().lerp(edge, (radiusRatio - 0.28) / 0.72);
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    map: starTexture,
    size: 0.18,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.48,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = -0.2;
  points.rotation.z = -0.12;
  return points;
}

function createDust(
  count: number,
  starTexture: THREE.Texture,
): THREE.Points {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    positions[positionIndex] = (Math.random() - 0.5) * 42;
    positions[positionIndex + 1] = (Math.random() - 0.5) * 24;
    positions[positionIndex + 2] = -2 - Math.random() * 28;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: "#a9bfd6",
    map: starTexture,
    size: 0.14,
    opacity: 0.16,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

function createConstellationLines(clusterCount: number): THREE.LineSegments {
  const positions: number[] = [];
  for (let cluster = 0; cluster < clusterCount; cluster += 1) {
    let x = (Math.random() - 0.5) * 72;
    let y = (Math.random() - 0.5) * 38;
    const z = -16 - Math.random() * 34;
    const segments = 2 + Math.floor(Math.random() * 3);
    for (let segment = 0; segment < segments; segment += 1) {
      const nextX = x + (Math.random() - 0.5) * 8;
      const nextY = y + (Math.random() - 0.5) * 6;
      positions.push(x, y, z, nextX, nextY, z);
      x = nextX;
      y = nextY;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  const material = new THREE.LineBasicMaterial({
    color: "#5e86a8",
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.LineSegments(geometry, material);
}

function createNebula(): THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> {
  const geometry = new THREE.PlaneGeometry(94, 56, 1, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.58 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIntensity;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int octave = 0; octave < 5; octave++) {
          value += amplitude * noise(p);
          p = p * 2.03 + vec2(13.7, 9.2);
          amplitude *= 0.48;
        }
        return value;
      }

      void main() {
        vec2 centered = vUv - 0.5;
        centered.x *= 1.65;
        float time = uTime * 0.018;
        float cloud = fbm(centered * 3.0 + vec2(time, -time * 0.7));
        cloud += fbm(centered * 6.0 - vec2(time * 0.6, time)) * 0.42;
        float vignette = smoothstep(0.86, 0.08, length(centered));
        float ribbon = exp(-abs(centered.y + sin(centered.x * 4.0 + time) * 0.11) * 5.2);
        vec3 blue = vec3(0.012, 0.045, 0.09);
        vec3 slate = vec3(0.08, 0.12, 0.18);
        vec3 silver = vec3(0.22, 0.25, 0.30);
        vec3 color = mix(blue, slate, smoothstep(0.22, 0.7, cloud));
        color = mix(color, silver, ribbon * 0.2);
        float alpha = (cloud * 0.3 + ribbon * 0.08) * vignette * uIntensity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const nebula = new THREE.Mesh(geometry, material);
  nebula.position.set(0, 0, -36);
  return nebula;
}

function resetCloud(motion: CloudMotion, depth?: number): void {
  motion.sprite.position.set(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    depth ?? -78 - Math.random() * 44,
  );
  const size = 10 + Math.random() * 14;
  motion.sprite.scale.set(size * 1.7, size, 1);
  motion.phase = Math.random() * Math.PI * 2;
}

function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (
      !(
        child instanceof THREE.Mesh ||
        child instanceof THREE.Points ||
        child instanceof THREE.LineSegments
      )
    )
      return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => material.dispose());
  });
}

export function GalaxyBackground({ onReady }: GalaxyBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const quality = getQualityProfile();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#02030a", 0.018);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      160,
    );
    camera.position.set(0, 0.5, 18);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: quality.dpr > 1.2,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFallback(true);
      onReadyRef.current();
      return;
    }

    renderer.setPixelRatio(quality.dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute("aria-hidden", "true");
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setFallback(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    setFallback(false);
    mount.appendChild(renderer.domElement);

    const starTexture = createStarTexture();
    const outerStars = createStarField(quality.stars, 76, starTexture);
    const flightStars = createFlightStars(quality.flightStars);
    const galaxy = createSpiralGalaxy(quality.galaxyStars, starTexture);
    const dust = createDust(quality.dust, starTexture);
    const constellations = createConstellationLines(
      quality.constellationClusters,
    );
    const nebula = createNebula();
    const cloudTexture = createCloudTexture();
    const clouds: CloudMotion[] = Array.from(
      { length: quality.clouds },
      (_, index) => {
        const material = new THREE.SpriteMaterial({
          map: cloudTexture,
          color: index % 2 === 0 ? "#6d8da9" : "#756d9f",
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const motion: CloudMotion = {
          sprite: new THREE.Sprite(material),
          speed: 1.25 + Math.random() * 1.25,
          driftX: (Math.random() - 0.5) * 0.12,
          phase: 0,
        };
        resetCloud(
          motion,
          -34 - index * (88 / Math.max(1, quality.clouds - 1)),
        );
        return motion;
      },
    );

    scene.add(
      outerStars,
      flightStars,
      galaxy,
      dust,
      constellations,
      nebula,
      ...clouds.map(({ sprite }) => sprite),
    );

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(quality.dpr);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      quality.bloomStrength,
      0.6,
      0.38,
    );
    composer.addPass(bloom);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const galaxyPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#82bfff"),
      new THREE.Color("#ad8cff"),
      new THREE.Color("#ffd59a"),
    ];
    const startTime = performance.now() - 2400;
    let animationFrame = 0;
    let running = !reduceMotion;
    let lastRender = 0;
    let previousElapsed = 2.4;
    let scrollTarget = 0;
    let scrollProgress = 0;

    const handlePointer = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * -2;
    };

    const render = (elapsed: number) => {
      const delta = Math.min(0.05, Math.max(0, elapsed - previousElapsed));
      previousElapsed = elapsed;
      pointer.lerp(pointerTarget, 0.035);
      scrollProgress += (scrollTarget - scrollProgress) * 0.045;
      const motionScale = reduceMotion ? 0 : 1;
      camera.position.x =
        Math.sin(elapsed * 0.22) * 0.45 * motionScale + pointer.x * 0.65;
      camera.position.y =
        0.5 +
        Math.cos(elapsed * 0.16) * 0.28 * motionScale +
        pointer.y * 0.4 -
        scrollProgress * 0.45;
      camera.lookAt(0, -scrollProgress * 0.25, -10);

      outerStars.rotation.y = elapsed * 0.003;
      outerStars.rotation.x = Math.sin(elapsed * 0.03) * 0.018;
      const outerMaterial = outerStars.material as THREE.PointsMaterial;
      outerMaterial.opacity =
        0.24 + Math.sin(elapsed * 0.9) * 0.025 * motionScale;
      const flightTime = flightStars.material.uniforms.uTime;
      if (flightTime) flightTime.value = elapsed;
      const galaxyCycleLength = 22;
      const galaxyCycle = Math.floor(elapsed / galaxyCycleLength);
      const galaxyPhase = elapsed % galaxyCycleLength;
      const galaxyFade =
        galaxyPhase < 2.5
          ? galaxyPhase / 2.5
          : galaxyPhase > 18
            ? (galaxyCycleLength - galaxyPhase) / 4
            : 1;
      const galaxyMaterial = galaxy.material as THREE.PointsMaterial;
      const galaxyColor =
        galaxyPalette[galaxyCycle % galaxyPalette.length] ?? galaxyPalette[0];
      if (galaxyColor) galaxyMaterial.color.copy(galaxyColor);
      galaxyMaterial.opacity =
        (0.36 + Math.sin(elapsed * 0.55) * 0.045 * motionScale) *
        THREE.MathUtils.clamp(galaxyFade, 0.08, 1);
      galaxy.rotation.y = elapsed * 0.012;
      galaxy.rotation.z = -0.12 + elapsed * 0.0035;
      galaxy.position.x = Math.sin(elapsed * 0.09) * 1.8 * motionScale;
      galaxy.position.y = Math.cos(elapsed * 0.07) * 0.9 * motionScale;
      dust.rotation.y = -elapsed * 0.007;
      constellations.rotation.y = elapsed * 0.0015;

      if (!reduceMotion) {
        clouds.forEach((motion) => {
          motion.sprite.position.z += motion.speed * delta;
          motion.sprite.position.x += motion.driftX * delta;
          const material = motion.sprite.material as THREE.SpriteMaterial;
          material.opacity =
            0.05 + Math.sin(elapsed * 0.22 + motion.phase) * 0.018;
          if (motion.sprite.position.z > 10) resetCloud(motion);
        });
      }

      const timeUniform = nebula.material.uniforms.uTime;
      if (timeUniform) timeUniform.value = elapsed;
      bloom.strength =
        quality.bloomStrength *
        (0.88 + scrollProgress * 0.12 + Math.sin(elapsed * 0.4) * 0.05);
      composer.render();
    };

    const handleScroll = () => {
      const maximumScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / maximumScroll));
      if (reduceMotion) {
        scrollProgress = scrollTarget;
        render((performance.now() - startTime) / 1000);
      }
    };

    const animate = (time: number) => {
      if (!running) return;
      animationFrame = window.requestAnimationFrame(animate);
      if (time - lastRender < quality.frameInterval) return;
      lastRender = time;
      render((time - startTime) / 1000);
    };

    const handleResize = () => {
      const nextQuality = getQualityProfile();
      renderer.setPixelRatio(nextQuality.dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setPixelRatio(nextQuality.dpr);
      composer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      render((performance.now() - startTime) / 1000);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(animationFrame);
        return;
      }
      if (!reduceMotion && !running) {
        running = true;
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    handleScroll();
    render(2.4);
    onReadyRef.current();
    if (!reduceMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      bloom.dispose();
      outputPass.dispose();
      composer.dispose();
      disposeObject(outerStars);
      disposeObject(flightStars);
      disposeObject(galaxy);
      disposeObject(dust);
      disposeObject(constellations);
      disposeObject(nebula);
      clouds.forEach(({ sprite }) => sprite.material.dispose());
      cloudTexture.dispose();
      starTexture.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`galaxy-background${fallback ? " is-fallback" : ""}`}
      aria-hidden="true"
    />
  );
}
