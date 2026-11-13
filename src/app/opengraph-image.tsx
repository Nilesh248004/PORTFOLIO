import { ImageResponse } from 'next/og';
import { profile } from '@/data/content';

export const alt = `${profile.name} | ${profile.title} at ${profile.company}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 90,
          background: 'linear-gradient(135deg,#060b1a 0%,#0b1736 45%,#2a1259 80%,#5b1a4a 100%)',
          color: '#eaf0ff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 96, height: 96, borderRadius: 28, background: 'linear-gradient(135deg,#2563eb,#7c3aed 55%,#db2777)', fontSize: 40, fontWeight: 700, color: '#fff' }}>NK</div>
        <div style={{ marginTop: 44, fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
        <div style={{ marginTop: 12, fontSize: 40, color: '#c4b5fd' }}>{profile.title}</div>
        <div style={{ marginTop: 28, fontSize: 30, color: '#a7b6d6' }}>{`${profile.company} · API automation · Full-stack · DevOps`}</div>
      </div>
    ),
    size,
  );
}
