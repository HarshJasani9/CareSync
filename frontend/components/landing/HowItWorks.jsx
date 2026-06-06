const steps = [
  {
    number: '1',
    title: 'Search and pick your doctor',
    body: 'Filter by specialization, availability, fee, and patient rating. Every doctor is reviewed and approved by the CareSync admin team before appearing on the platform.',
  },
  {
    number: '2',
    title: 'Book a time slot',
    body: "Pick a date and time from the doctor's live availability. You'll get a real-time confirmation the moment the doctor approves your request.",
  },
  {
    number: '3',
    title: 'Get your prescription digitally',
    body: 'Your doctor writes the prescription directly in CareSync. You receive a formatted PDF instantly — no handwriting to decipher, no paper to lose.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 md:py-16 border-t border-gray-100 dark:border-gray-800">
      <div className="mb-6 md:mb-10">
        <div className="inline-block text-xs uppercase tracking-wide bg-primary-50 text-primary-900 border border-primary-100 rounded-full px-3 py-1">
          How it works
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          From booking to prescription in three steps
        </h2>
      </div>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={step.number} className="flex gap-4">
              {/* LEFT */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-900 text-sm font-medium flex items-center justify-center flex-shrink-0">
                  {step.number}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-gray-100 dark:bg-gray-800 mt-2" />
                )}
              </div>

              {/* RIGHT */}
              <div className={isLast ? "pb-0" : "pb-10"}>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-full md:max-w-lg">
                  {step.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
