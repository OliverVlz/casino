'use client';
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './LightTunnel.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float flowDir = uFlowDir;
  float speedBase = uSpeed * 4.0 * flowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);

  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;

  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = (fract(finalAngle * cablesCount) - 0.5);

  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);

  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));

  // --- PREMIUM CASINO NEON PLAYING CARDS ---
  float cardHalfW = cableThick * 1.55 * uPulseWidth;
  float cardHalfH = uPulseLength * 0.52; // Proper 2.5:3.5 playing card aspect ratio
  float cardCorner = 0.038;
  vec2 cardUV = vec2(gvX, pulseFact - 0.5);

  // Card rounded rectangle signed distance field
  vec2 dCard = abs(cardUV) - vec2(cardHalfW - cardCorner, cardHalfH - cardCorner);
  float distCard = length(max(dCard, vec2(0.0))) + min(max(dCard.x, dCard.y), 0.0) - cardCorner;
  float cardEdge = max(fwidth(distCard), 0.0018);
  float cardMask = 1.0 - smoothstep(0.0, cardEdge, distCard);

  // Outer neon glow around the card perimeter
  float cardOuterGlow = exp(-max(distCard, 0.0) * 45.0) * (1.0 - cardMask);

  // Double gold/neon border
  float innerCardDist = distCard + 0.018;
  float cardOuterBorder = clamp(cardMask - (1.0 - smoothstep(0.0, cardEdge, innerCardDist)), 0.0, 1.0);
  float pinstripeDist = distCard + 0.036;
  float pinstripe = clamp((1.0 - smoothstep(0.0, cardEdge, pinstripeDist + 0.008)) - (1.0 - smoothstep(0.0, cardEdge, pinstripeDist)), 0.0, 1.0);

  // Casino Guilloche / Diamond geometric pattern on card back/face
  vec2 gridUV = cardUV / vec2(cardHalfW, cardHalfH);
  float lattice = sin(gridUV.x * 24.0 + gridUV.y * 16.0) * sin(gridUV.x * 24.0 - gridUV.y * 16.0);
  float cardPattern = smoothstep(0.4, 0.7, abs(lattice)) * 0.18;

  // Suit Selection: 0 = Spades (♠), 1 = Hearts (♥), 2 = Diamonds (♦), 3 = Clubs (♣)
  float suitType = mod(cableID + floor(scroll), 4.0);

  // Central Suit Emblem (Accurate SVG-quality procedural geometry)
  vec2 suitUV = cardUV / vec2(cardHalfW * 0.48, cardHalfH * 0.42);
  float suitShape = 0.0;

  // Bounded suit box check to strictly prevent any shape from escaping center of card
  if (abs(suitUV.x) < 0.95 && abs(suitUV.y) < 0.95) {
    if (suitType < 0.5) {
      // ♠ SPADE: Upward cone + lower twin lobes + pedestal stem
      vec2 p = vec2(suitUV.x, -suitUV.y);
      float dHeadCone = max(dot(vec2(abs(p.x), p.y + 0.38), vec2(0.804, -0.594)), max(-0.38 - p.y, p.y - 0.06));
      float dHeadLobes = length(vec2(abs(p.x) - 0.15, p.y - 0.06)) - 0.19;
      float dHead = min(dHeadLobes, dHeadCone);
      float stemHalfW = 0.035 + (-suitUV.y - 0.08) * 0.40;
      float dStem = max(abs(suitUV.x) - stemHalfW, max(-suitUV.y - 0.42, suitUV.y + 0.08));
      float dSpade = min(dHead, dStem);
      suitShape = 1.0 - smoothstep(-0.02, 0.02, dSpade);
    } else if (suitType < 1.5) {
      // ♥ HEART: Upper twin lobes + downward tapering V cone
      vec2 p = suitUV;
      float dCone = max(dot(vec2(abs(p.x), p.y + 0.38), vec2(0.804, -0.594)), max(-0.38 - p.y, p.y - 0.06));
      float dLobes = length(vec2(abs(p.x) - 0.15, p.y - 0.06)) - 0.19;
      float dHeart = min(dLobes, dCone);
      suitShape = 1.0 - smoothstep(-0.02, 0.02, dHeart);
    } else if (suitType < 2.5) {
      // ♦ DIAMOND: Sharp multi-faceted rhombus
      float dRhombus = abs(suitUV.x) * 1.45 + abs(suitUV.y) * 1.0 - 0.38;
      suitShape = 1.0 - smoothstep(-0.02, 0.02, dRhombus);
    } else {
      // ♣ CLUB: Tri-circle trefoil with bottom stem
      vec2 p = suitUV;
      float cTop = length(p - vec2(0.0, 0.14)) - 0.17;
      float cSides = length(vec2(abs(p.x) - 0.16, p.y - (-0.06))) - 0.17;
      float cLobes = min(cTop, cSides);
      float stemHalfW = 0.035 + (-p.y - 0.06) * 0.40;
      float dStem = max(abs(p.x) - stemHalfW, max(-p.y - 0.40, p.y + 0.06));
      float dClub = min(cLobes, dStem);
      suitShape = 1.0 - smoothstep(-0.02, 0.02, dClub);
    }
  }

  // Authentic Casino Ace Corner Indices (A + mini-suit in Top-Left & Bottom-Right)
  float cornerAce = 0.0;
  if (cardUV.x * cardUV.y < 0.0) {
    vec2 pCard = (cardUV.x < 0.0) ? cardUV : -cardUV;
    float cornerScale = cardHalfH * 0.16;
    vec2 cUV = (pCard - vec2(-cardHalfW * 0.63, cardHalfH * 0.66)) / cornerScale;
    if (abs(cUV.x) < 1.3 && abs(cUV.y) < 1.3) {
      // Capital Letter 'A' (Ace)
      vec2 pA = cUV - vec2(0.0, 0.38);
      vec2 pSym = vec2(abs(pA.x), pA.y);
      float dLeg = sdSegment(pSym, vec2(0.18, -0.26), vec2(0.0, 0.26));
      float dBar = sdSegment(pA, vec2(-0.10, -0.06), vec2(0.10, -0.06));
      float aLetter = 1.0 - smoothstep(-0.02, 0.02, min(dLeg, dBar) - 0.048);

      // Mini Suit Pip directly beneath the 'A'
      vec2 pPip = (cUV - vec2(0.0, -0.42)) * 1.6;
      float dSuitPip = 1.0;
      if (suitType < 0.5) {
        // ♠ Mini Spade
        vec2 pSp = vec2(pPip.x, -pPip.y);
        float dHeadCone = max(dot(vec2(abs(pSp.x), pSp.y + 0.32), vec2(0.804, -0.594)), max(-0.32 - pSp.y, pSp.y - 0.05));
        float dHeadLobes = length(vec2(abs(pSp.x) - 0.13, pSp.y - 0.05)) - 0.16;
        float dStem = max(abs(pPip.x) - 0.04, max(-pPip.y - 0.35, pPip.y + 0.06));
        dSuitPip = min(min(dHeadLobes, dHeadCone), dStem);
      } else if (suitType < 1.5) {
        // ♥ Mini Heart
        float dCone = max(dot(vec2(abs(pPip.x), pPip.y + 0.32), vec2(0.804, -0.594)), max(-0.32 - pPip.y, pPip.y - 0.05));
        float dLobes = length(vec2(abs(pPip.x) - 0.13, pPip.y - 0.05)) - 0.16;
        dSuitPip = min(dLobes, dCone);
      } else if (suitType < 2.5) {
        // ♦ Mini Diamond
        dSuitPip = abs(pPip.x) * 1.4 + abs(pPip.y) * 1.0 - 0.32;
      } else {
        // ♣ Mini Club
        float cTop = length(pPip - vec2(0.0, 0.12)) - 0.15;
        float cSides = length(vec2(abs(pPip.x) - 0.14, pPip.y - (-0.05))) - 0.15;
        float dStem = max(abs(pPip.x) - 0.04, max(-pPip.y - 0.35, pPip.y + 0.05));
        dSuitPip = min(min(cTop, cSides), dStem);
      }
      float pipShape = 1.0 - smoothstep(-0.03, 0.03, dSuitPip);
      cornerAce = clamp(aLetter + pipShape, 0.0, 1.0);
    }
  }

  // Neon Casino Palette: Ruby Red for Hearts/Diamonds, Cyber Champagne/Violet for Spades/Clubs
  vec3 rubyRed = vec3(1.0, 0.18, 0.35);
  vec3 neonGold = vec3(1.0, 0.86, 0.48);
  vec3 electricViolet = vec3(0.72, 0.38, 1.0);

  bool isRed = (suitType > 0.5 && suitType < 2.5);
  vec3 suitColor = isRed ? rubyRed : neonGold;
  vec3 suitGlow = isRed ? vec3(1.0, 0.3, 0.45) : electricViolet;

  // Dark obsidian card core with deep rich contrast
  vec3 cardBase = vec3(0.05, 0.04, 0.08) + cardPattern * vec3(0.15, 0.12, 0.2);
  vec3 cardDecorated = mix(cardBase, neonGold * 1.4, cardOuterBorder * 0.95);
  cardDecorated = mix(cardDecorated, neonGold * 0.8, pinstripe * 0.8);
  cardDecorated = mix(cardDecorated, suitColor * 1.8, clamp(suitShape * 0.95 + cornerAce * 0.95, 0.0, 1.0));

  // Card composition with glow aura
  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aCard = cardMask;

  vec3 cardFinal = cardDecorated * aCard * 3.6 + suitGlow * cardOuterGlow * 1.8;

  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + cardFinal;

  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aCard + cardOuterGlow * 0.6, 0.0, 1.0) * distFade;

  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  if (uLightMode > 0.5) {
    float peak = max(o.r, max(o.g, o.b));
    vec3 chroma = pow(clamp(o.rgb / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, o.a * 0.95), 1.0);
  } else {
    fragColor = o;
  }
}
`;

const ctxMap = new WeakMap();

const LightTunnel = ({
  cableColor = '#A855F7',
  pulseColor = '#A855F7',
  tunnelColor = '#5227FF',
  tunnelOpacity = 0,
  speed = 0.1,
  flowDirection = 'outward',
  pulseSpeed = 2,
  pulseLength = 0.28,
  pulseBlend = 1,
  pulseWidth = 1,
  cableCount = 20,
  thickness = 0.35,
  rimWidth = 0.15,
  waviness = 0.3,
  sway = 0.5,
  size = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  glow = 1.0,
  fadeNear = 0.5,
  fadeFar = 2,
  brightness = 1.0,
  colorVariance = true,
  grain = true,
  grainIntensity = 0.05,
  opacity = 1.0,
  mouseInteraction = true,
  mouseStrength = 0.1,
  lightMode = false,
  className = ''
}) => {
  const containerRef = useRef(null);
  const mouseEnabledRef = useRef(mouseInteraction);
  const mouseStrengthRef = useRef(mouseStrength);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: 0.1 },
        uFlowDir: { value: -1.0 },
        uPulseSpeed: { value: 2.0 },
        uPulseLength: { value: 0.28 },
        uPulseBlend: { value: 1.0 },
        uPulseWidth: { value: 1.0 },
        uCableCount: { value: 20 },
        uThickness: { value: 0.35 },
        uRimWidth: { value: 0.15 },
        uWaviness: { value: 0.3 },
        uSway: { value: 0.5 },
        uSize: { value: 1.0 },
        uCenter: { value: new Float32Array([0, 0]) },
        uMouseOffset: { value: new Float32Array([0, 0]) },
        uGlow: { value: 1.0 },
        uFadeNear: { value: 0.5 },
        uFadeFar: { value: 2.0 },
        uBrightness: { value: 1.0 },
        uColorVariance: { value: 1.0 },
        uOpacity: { value: 1.0 },
        uCableColor: { value: new Float32Array([0.65882353, 0.33333333, 0.96862745]) },
        uPulseColor: { value: new Float32Array([0.65882353, 0.33333333, 0.96862745]) },
        uTunnelColor: { value: new Float32Array([0.32156863, 0.15294118, 1]) },
        uTunnelOpacity: { value: 0.0 },
        uGrain: { value: 1.0 },
        uGrainIntensity: { value: 0.05 },
        uLightMode: { value: 0.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    const handleMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      targetMouse = [(e.clientX - rect.left) / rect.width, 1.0 - (e.clientY - rect.top) / rect.height];
    };
    const handleMouseLeave = () => {
      targetMouse = [0.5, 0.5];
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = t => {
      program.uniforms.iTime.value = (t - t0) * 0.001;

      if (mouseEnabledRef.current) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      } else {
        currentMouse[0] += 0.05 * (0.5 - currentMouse[0]);
        currentMouse[1] += 0.05 * (0.5 - currentMouse[1]);
      }
      const off = program.uniforms.uMouseOffset.value;
      off[0] = (currentMouse[0] - 0.5) * mouseStrengthRef.current;
      off[1] = (currentMouse[1] - 0.5) * mouseStrengthRef.current;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      ctxMap.delete(container);
      try {
        container.removeChild(canvas);
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    mouseEnabledRef.current = mouseInteraction;
    mouseStrengthRef.current = mouseStrength;

    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const { program } = ctx;
    const u = program.uniforms;

    u.uSpeed.value = speed;
    u.uFlowDir.value = flowDirection === 'outward' ? -1.0 : 1.0;
    u.uPulseSpeed.value = pulseSpeed;
    u.uPulseLength.value = pulseLength;
    u.uPulseBlend.value = pulseBlend;
    u.uPulseWidth.value = pulseWidth;
    u.uCableCount.value = cableCount;
    u.uThickness.value = thickness;
    u.uRimWidth.value = rimWidth;
    u.uWaviness.value = waviness;
    u.uSway.value = sway;
    u.uSize.value = size;
    const center = u.uCenter.value;
    center[0] = centerX;
    center[1] = centerY;
    u.uGlow.value = glow;
    u.uFadeNear.value = fadeNear;
    u.uFadeFar.value = fadeFar;
    u.uBrightness.value = brightness;
    u.uColorVariance.value = colorVariance ? 1.0 : 0.0;
    u.uGrain.value = grain ? 1.0 : 0.0;
    u.uGrainIntensity.value = grainIntensity;
    u.uOpacity.value = opacity;
    u.uLightMode.value = lightMode ? 1.0 : 0.0;
    const cable = hexToRgb(cableColor);
    const cableU = u.uCableColor.value;
    cableU[0] = cable[0];
    cableU[1] = cable[1];
    cableU[2] = cable[2];
    const pulse = hexToRgb(pulseColor);
    const pulseU = u.uPulseColor.value;
    pulseU[0] = pulse[0];
    pulseU[1] = pulse[1];
    pulseU[2] = pulse[2];
    const tunnel = hexToRgb(tunnelColor);
    const tunnelU = u.uTunnelColor.value;
    tunnelU[0] = tunnel[0];
    tunnelU[1] = tunnel[1];
    tunnelU[2] = tunnel[2];
    u.uTunnelOpacity.value = tunnelOpacity;
  }, [
    cableColor,
    pulseColor,
    tunnelColor,
    tunnelOpacity,
    speed,
    flowDirection,
    pulseSpeed,
    pulseLength,
    pulseBlend,
    pulseWidth,
    cableCount,
    thickness,
    rimWidth,
    waviness,
    sway,
    size,
    centerX,
    centerY,
    glow,
    fadeNear,
    fadeFar,
    brightness,
    colorVariance,
    grain,
    grainIntensity,
    opacity,
    mouseInteraction,
    mouseStrength,
    lightMode
  ]);

  return <div ref={containerRef} className={`light-tunnel-container ${className}`.trim()} />;
};

export default LightTunnel;
