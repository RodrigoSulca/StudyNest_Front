import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
