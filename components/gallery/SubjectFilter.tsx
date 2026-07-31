interface SubjectFilterProps {
  subjects: string[];
  selectedSubject: string;
  onChange: (subject: string) => void;
}

export default function SubjectFilter({
  subjects,
  selectedSubject,
  onChange,
}: SubjectFilterProps) {
  return (
    <section className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex gap-8 overflow-x-auto whitespace-nowrap text-sm">

        <button
          onClick={() => onChange("all")}
          className={
            selectedSubject === "all"
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-black"
          }
        >
          All subjects
        </button>

        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onChange(subject)}
            className={
              selectedSubject === subject
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-black"
            }
          >
            {subject}
          </button>
        ))}

      </div>
    </section>
  );
}