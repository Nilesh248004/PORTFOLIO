import type { Stat } from '@/data/content';

// Row of big-number cards. Used on the home page and under the title of a project page.
export default function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="stats" data-stagger>
      {items.map((s) => (
        <div key={s.label} className="stat glass">
          <b>
            {typeof s.value === 'number' ? <span data-count={s.value}>{s.value.toLocaleString('en-US')}</span> : <span>{s.value}</span>}
            {s.suffix && <em>{s.suffix}</em>}
          </b>
          <p>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
