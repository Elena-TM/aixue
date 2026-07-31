interface StatusFilterProps {
  status: "all" | "available" | "archive";
  onChange: (status: "all" | "available" | "archive") => void;
}

export default function StatusFilter({
  status,
  onChange,
}: StatusFilterProps) {
  const buttons = [
    { label: "All", value: "all" as const },
    { label: "Available", value: "available" as const },
    { label: "Archive", value: "archive" as const },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 pt-2">
      <div className="flex gap-8 border-b border-neutral-200 pb-4">
        {buttons.map((button) => {
          const active = status === button.value;

          return (
            <button
              key={button.value}
              onClick={() => onChange(button.value)}
              className={`uppercase tracking-[0.25em] text-sm pb-2 transition-colors ${
                active
                  ? "border-b-2 border-red-700 text-black"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {button.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}