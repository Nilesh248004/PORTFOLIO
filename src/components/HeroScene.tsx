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
    const rim = new THREE.PointLight(0x38bdf8, 30, 24);
    rim.position.set(-4, 2, 3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // The scene is only redrawn when something changed (scroll, resize, label font loaded).
    let dirty = true;

    const geo = new RoundedBoxGeometry(2.6, 0.18, 2.6, 4, 0.1);
    const edgeGeo = new THREE.EdgesGeometry(geo, 40);
    const disposables: { dispose: () => void }[] = [geo, edgeGeo];

    // next/font exposes the real (hashed) family name through this CSS variable.
    const monoVar = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
    const monoFamily = monoVar || 'ui-monospace, monospace';

    const labels = ['BUILD', 'TEST', 'SHIP'];
    const slabs = labels.map((label, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: i === 2 ? 0x3b82f6 : 0x2563eb,
        transparent: true,
        opacity: i === 2 ? 0.62 : 0.38,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.9 });
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
        dirty = true;
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

    // The slabs never react to the mouse and never move on their own: only scrolling the page moves them.
    const state = { sy: window.scrollY };
    const onScroll = () => {
      state.sy = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    group.rotation.y = -0.75 + Math.min(state.sy, 900) * 0.0017;

    const resize = () => {
      const w = el.clientWidth || 360;
      const h = el.clientHeight || 360;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    let raf = 0;
    let lastSpread = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const targetY = -0.75 + Math.min(state.sy, 900) * 0.0017;
      const dy = targetY - group.rotation.y;
      const spread = 0.62 + (Math.min(state.sy, 700) / 700) * 0.55;
      // Nothing changed since the last frame: skip drawing instead of re-rendering an identical image.
      if (!dirty && Math.abs(dy) < 0.0005 && spread === lastSpread) return;
      dirty = false;
      lastSpread = spread;
      group.rotation.y += dy * 0.06;
      slabs.forEach((m, i) => {
        m.position.y = i * spread;
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return <div ref={host} className="scene" aria-hidden="true" />;
}
