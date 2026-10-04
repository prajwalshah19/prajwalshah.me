export default function RequestError({ label }: { label: string }) {
  return (
    <p role="alert" className="px-6 py-8 text-center text-sm text-primary dark:text-secondary">
      Couldn’t load {label}. Please refresh to try again.
    </p>
  );
}
