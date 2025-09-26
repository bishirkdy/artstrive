import { useRouteError, Link } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  const status = error?.status || 500;

  // Map known errors to human-readable messages
  const friendlyMessage = () => {
    if (status === 404) return "Sorry, the page you are looking for does not exist.";
    if (status === 500) return "Oops! Something went wrong on our server. Please try again later.";
    if (error?.message) return error.message;
    return "An unexpected error occurred. Please refresh or try again later.";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primary)] p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-6xl font-extrabold text-red-500">{status}</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {status === 404 ? "Page Not Found" : "Oops! Something went wrong"}
        </h2>
        <p className="mt-2 text-gray-600">{friendlyMessage()}</p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
