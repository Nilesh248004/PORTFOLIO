import type { Stat } from '@/data/content';

// Row of big-number cards, shown under the title of a project page.
// The animations live in ScrollEffects and are driven by the data-* attributes below:
//   data-count  -> number counts up      data-decode -> word scrambles, then settles
//   data-stream -> label appears word by word (like a streamed answer)
// Animated text is hidden from screen readers and replaced by a plain copy, so it is never read mid-animation.
export default function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="stats" data-stagger>
      {items.map((s) => (
        <div key={s.label} className="stat glass">
          <b>
            {typeof s.value === 'number' ? (
              <span data-count={s.value}>{s.value.toLocaleString('en-US')}</span>
            ) : (
              <>
                <span className="sr-only">{s.value}</span>
                <span data-decode={s.value} aria-hidden="true">
                  {s.value}
                </span>
              </>
            )}
            {s.suffix && <em>{s.suffix}</em>}
          </b>
          {s.stream ? (
            <p>
              <span className="sr-only">{s.label}</span>
              <span data-stream aria-hidden="true">
                {s.label.split(' ').map((word, i) => (
                  <span key={i}>{word} </span>
                ))}
              </span>
            </p>
          ) : (
            <p>{s.label}</p>
          )}
        </div>
      ))}
    </div>
  );
}
