import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap center" style={{ padding: "120px 0" }}>
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub">The page you are looking for does not exist or has moved.</p>
      <div className="cta-center"><Link className="btn btn-primary" href="/collection">Browse the collection →</Link></div>
    </div>
  );
}
