import { UserCheck, FileText, Bell, Lock, Star, Calendar } from 'lucide-react';

const iconMap = { UserCheck, FileText, Bell, Lock, Star, Calendar };

const features = [
  {
    icon: 'UserCheck',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    title: 'Admin-verified doctors',
    body: "Every doctor application is reviewed before going live. You won't find unverified profiles appearing in search.",
  },
  {
    icon: 'FileText',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Digital prescriptions',
    body: 'Receive a properly formatted PDF the moment your appointment ends. Download, share, or store it in your health vault.',
  },
  {
    icon: 'Bell',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Real-time notifications',
    body: "Appointment confirmed? Prescription ready? You'll know instantly — no refreshing, no waiting on an email.",
  },
  {
    icon: 'Lock',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    title: 'Secure health vault',
    body: 'Upload lab results and scans. Share individual records with specific doctors — you control who sees what.',
  },
  {
    icon: 'Star',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Verified patient reviews',
    body: 'Reviews are only possible after a completed appointment. Every rating comes from a real visit.',
  },
  {
    icon: 'Calendar',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    title: 'Flexible scheduling',
    body: 'Doctors publish their own weekly availability. You see only open slots — no phone calls, no back-and-forth.',
  },
];

export default function Features() {
  return (
    <section className="py-10 md:py-16 border-t border-gray-100 dark:border-gray-800">
      <div className="mb-6 md:mb-10">
        <div className="inline-block text-xs uppercase tracking-wide bg-primary-50 text-primary-900 border border-primary-100 rounded-full px-3 py-1">
          Features
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          Built for real patients, not press releases
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon];
          return (
            <div key={index} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 md:p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}>
                <Icon size={18} className={feature.iconColor} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {feature.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
