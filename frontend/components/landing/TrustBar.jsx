import { Activity, Brain, Bone, Eye, Stethoscope } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="border-y border-gray-100 dark:border-gray-800 py-4 overflow-x-auto">
      <div className="flex items-center gap-4 min-w-max md:min-w-0">
        
        {/* Left label */}
        <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
          Works with specialists in
        </span>

        {/* Right pills */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Activity size={13} className="text-gray-400" />
            <span>Cardiology</span>
          </div>
          
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Brain size={13} className="text-gray-400" />
            <span>Neurology</span>
          </div>
          
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Bone size={13} className="text-gray-400" />
            <span>Orthopedics</span>
          </div>
          
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Eye size={13} className="text-gray-400" />
            <span>Ophthalmology</span>
          </div>
          
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Stethoscope size={13} className="text-gray-400" />
            <span>General Medicine</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 dark:border-primary-900 px-3 py-1.5 text-xs text-primary-600 dark:text-primary-400">
            <span>+18 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
