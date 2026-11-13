import Link from 'next/link';
import Nav from '@/components/Nav';

export default function NotFound() {
  return (
    <div className="page">
      <Nav home={false} />
      <main id="main" className="container notfound">
        <p className="eyebrow">404</p>
        <h1>That page does not exist</h1>
        <p>The link may be old or mistyped. The projects and contact form are on the home page.</p>
        <Link className="btn btn-primary" href="/">
          Back to home
        </Link>
      </main>
    </div>
  );
}
