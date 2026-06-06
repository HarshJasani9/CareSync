const stats = [
  { number: '2,000+', label: 'Patients on platform' },
  { number: '180+',   label: 'Verified doctors' },
  { number: '4.8',    label: 'Average doctor rating' },
  { number: '<2 min', label: 'Average booking time' },
];

export default function Stats() {
  return (
    <section className="py-14 border-t border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
            <p className="text-3xl font-semibold text-primary-600 tracking-tight">
              {stat.number}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
