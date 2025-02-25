"use client";

export default function GlobalError({ error, reset }) {
  console.error(error);
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 className="font-bold text-xl">Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Try again</button>
    </div>
  );
}
