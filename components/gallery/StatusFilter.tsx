export default function StatusFilter() {
  return (
    <section className="max-w-7xl mx-auto px-8 pt-2">

      <div className="flex gap-8 border-b border-neutral-200 pb-4">

        <button className="uppercase tracking-[0.25em] text-sm border-b-2 border-red-700 pb-2">
          All
        </button>

        <button className="uppercase tracking-[0.25em] text-sm text-neutral-500 hover:text-black transition-colors">
          Available
        </button>

        <button className="uppercase tracking-[0.25em] text-sm text-neutral-500 hover:text-black transition-colors">
          Archive
        </button>

      </div>

    </section>
  );
}