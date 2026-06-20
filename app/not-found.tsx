import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 text-center">
      <p className="font-display text-7xl font-semibold text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-full bg-gold px-6 py-3 font-medium text-white shadow-soft transition-colors hover:bg-gold-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
