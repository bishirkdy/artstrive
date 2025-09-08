export default function ErrorMessage({ code, title = "Something went wrong", details }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[var(--color-primary)] text-white px-4">
      {code && (
        <span className="text-6xl font-bold text-red-500 mb-4">
          {code}
        </span>
      )}
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      {details && (
        <p className="text-sm text-gray-400 max-w-lg text-center whitespace-pre-wrap">
          {details}
        </p>
      )}
    </div>
  );
}
