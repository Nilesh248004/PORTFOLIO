'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Three glass slabs (BUILD / TEST / SHIP) that react to the cursor and to scroll.
export default function HeroScene({ onFail }: { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      onFail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    camera.position.set(0, 5.0, 9.4);
    camera.lookAt(0, 0.7, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xbfd8ff, 2.4);
    key.position.set(4, 8, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x6366f1, 30, 24);
    rim.position.set(-4, 2, 3);
    scene.add(rim);
    const rim2 = new THREE.PointLight(0xec4899, 22, 24);
    rim2.position.set(4, 1, 3);
    scene.add(rim2);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new RoundedBoxGeometry(2.6, 0.18, 2.6, 4, 0.1);
    const edgeGeo = new THREE.EdgesGeometry(geo, 40);
    const disposables: { dispose: () => void }[] = [geo, edgeGeo];

    // next/font exposes the real (hashed) family name through this CSS variable.
    const monoVar = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
    const monoFamily = monoVar || 'ui-monospace, monospace';

    const labels = ['BUILD', 'TEST', 'SHIP'];
    // One colour per slab: blue to build, green when the tests pass, pink to ship.
    const slabColors = [0x3b82f6, 0x22c55e, 0xec4899];
    const edgeColors = [0x93c5fd, 0x86efac, 0xf9a8d4];
    const slabs = labels.map((label, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: slabColors[i],
        transparent: true,
        opacity: i === 2 ? 0.62 : 0.38,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const lineMat = new THREE.LineBasicMaterial({ color: edgeColors[i], transparent: true, opacity: 0.9 });
      mesh.add(new THREE.LineSegments(edgeGeo, lineMat));

      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 128;
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      const drawLabel = () => {
        const g = c.getContext('2d');
        if (!g) return;
        g.clearRect(0, 0, c.width, c.height);
        g.font = `700 72px ${monoFamily}`;
        g.fillStyle = '#ffffff';
        g.textBaseline = 'middle';
        g.fillText(label.split('').join(' '), 12, 64);
        tex.needsUpdate = true;
      };
      drawLabel();
      // Redraw once the real mono font is available: it may still be downloading on the first draw.
      // `fonts.ready` never rejects; `fonts.load` can (e.g. when the size-adjusted fallback face has no local font).
      document.fonts?.ready.then(drawLabel);
      document.fonts?.load(`700 72px ${monoFamily}`).then(drawLabel).catch(() => {});
      const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      const labelGeo = new THREE.PlaneGeometry(1.9, 0.475);
      const plane = new THREE.Mesh(labelGeo, labelMat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(-0.25, 0.101, 0.95);
      mesh.add(plane);

      disposables.push(mat, lineMat, tex, labelMat, labelGeo);
      group.add(mesh);
      return mesh;
    });

    // The slabs are the one animated element in the hero: they follow the mouse, spread out on scroll and bob gently.
    const state = { mx: 0, my: 0, sy: window.scrollY };
    const onMove = (e: PointerEvent) => {
      state.mx = (e.clientX / window.innerWidth - 0.5) * 2;
      state.my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      state.sy = window.scrollY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const w = el.clientWidth || 360;
      const h = el.clientHeight || 360;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const s = Math.min(state.sy, 900);
      const targetY = -0.75 + state.mx * 0.35 + s * 0.0017;
      group.rotation.y += (targetY - group.rotation.y) * 0.06;
      group.rotation.x += (state.my * 0.1 - group.rotation.x) * 0.06;
      const spread = 0.62 + (Math.min(state.sy, 700) / 700) * 0.55 + Math.sin(t * 0.9) * 0.04;
      slabs.forEach((m, i) => {
        m.position.y = i * spread + (i > 0 ? Math.sin(t * 1.1 + i) * 0.05 : 0);
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return <div ref={host} className="scene" aria-hidden="true" />;
}
