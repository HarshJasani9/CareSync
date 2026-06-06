import { Star } from 'lucide-react';

const testimonials = [
  {
    stars: 5,
    quote: "Got my cardiologist appointment confirmed in under 10 minutes. The prescription was in my inbox before I even reached the parking lot.",
    initials: 'PJ',
    avatarBg: 'bg-primary-50',
    avatarText: 'text-primary-900',
    name: 'Priya J.',
    city: 'Ahmedabad',
  },
  {
    stars: 5,
    quote: "I travel a lot for work. Being able to upload my old reports and share them with a new doctor instantly saved me an entire consultation.",
    initials: 'RM',
    avatarBg: 'bg-blue-50',
    avatarText: 'text-blue-900',
    name: 'Rahul M.',
    city: 'Mumbai',
  },
  {
    stars: 4,
    quote: "As someone managing a chronic condition, having all my prescriptions in one place and being able to track follow-ups is genuinely useful.",
    initials: 'SK',
    avatarBg: 'bg-amber-50',
    avatarText: 'text-amber-900',
    name: 'Sneha K.',
    city: 'Bangalore',
  },
];

export default function Testimonials() {
  return (
    <section className="py-10 md:py-16 border-t border-gray-100 dark:border-gray-800">
      <div className="mb-6 md:mb-10">
        <div className="inline-block text-xs uppercase tracking-wide bg-primary-50 text-primary-900 border border-primary-100 rounded-full px-3 py-1">
          Patient stories
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          What people actually say
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex-col ${index === 2 ? 'hidden sm:flex' : 'flex'}`}>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < testimonial.stars ? "#BA7517" : "none"}
                  stroke={i < testimonial.stars ? "none" : "#BA7517"}
                  className={i < testimonial.stars ? "" : "opacity-40"}
                />
              ))}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed mb-5 flex-1">
              "{testimonial.quote}"
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 mt-auto">
              <div className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center flex-shrink-0 ${testimonial.avatarBg} ${testimonial.avatarText}`}>
                {testimonial.initials}
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {testimonial.city}
                </p>
              </div>

              <span className="ml-auto text-[10px] bg-primary-50 text-primary-900 rounded-full px-2 py-0.5">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
