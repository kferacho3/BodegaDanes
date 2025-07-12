'use client';

import {
  ClockIcon,
  ExclamationCircleIcon,
  HomeModernIcon,
  PhoneIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

/** 3 · Essential Event Logistics */
export default function StepLogistics({ onBack, onNext }: Props) {
  const { register, resetField,  } = useFormContext<FormValues>();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function markNA() {
    const fields: (keyof FormValues)[] = [
      'eventStartTime',
      'eventEndTime',
      'guestCount',
      'ageDemographics',
      'venueContact',
      'kitchenFacilities',
      'setupRestrictions',
    ];
    fields.forEach((f) => resetField(f));
    onNext();
  }

  /** Enhanced input styles */
  const inputBase = `
    mt-2 w-full rounded-2xl border border-silver-dark/30 
    bg-charcoal/40 backdrop-blur-sm px-4 py-3 
    text-silver-light placeholder-silver-light/40
    focus:border-gold focus:ring-2 focus:ring-gold/30 focus:bg-charcoal/60
    transition-all duration-300
    font-body text-base
  `;

  const textareaBase = `
    ${inputBase} resize-none
  `;

  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Event logistics information"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 3</span>
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
        </div>
        
        <h2 className="font-header text-3xl sm:text-4xl lg:text-5xl">
          <span 
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `url('/textures/chalk-white.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.1)',
            }}
          >
            Event Logistics
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-2xl mx-auto text-sm sm:text-base">
          Help us understand your event details so we can deliver the perfect bodega experience
        </p>
      </header>

      {/* Main form container */}
      <div className="max-w-4xl mx-auto">
        <fieldset 
          className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Background texture */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/textures/chalk-Menuboard2.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Content wrapper */}
          <div className="relative bg-charcoal-light/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10">
            <legend className="flex items-center gap-2 font-header text-gold text-xl sm:text-2xl mb-8">
              <SparklesIcon className="w-6 h-6" />
              Essential Details
            </legend>

            {/* Time section */}
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Start Time */}
                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light">
                      <ClockIcon className="w-5 h-5 text-gold" />
                      Event Start Time
                    </span>
                    <input 
                      type="time" 
                      {...register('eventStartTime')} 
                      className={`${inputBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                {/* End Time */}
                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light">
                      <ClockIcon className="w-5 h-5 text-gold" />
                      Event End Time
                    </span>
                    <input 
                      type="time" 
                      {...register('eventEndTime')} 
                      className={`${inputBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                {/* Guest Count */}
                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light">
                      <UserGroupIcon className="w-5 h-5 text-gold" />
                      Estimated Guest Count
                    </span>
                    <input
                      type="number"
                      min={1}
                      {...register('guestCount')}
                      placeholder="e.g., 50"
                      className={`${inputBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                {/* Age Demographics */}
                <div className="group">
                  <label className="block relative">
                    <span className="flex items-center gap-2 font-header text-silver-light">
                      <UserGroupIcon className="w-5 h-5 text-gold" />
                      Age Demographics
                      <button
                        type="button"
                        className="ml-1 text-silver-light/60 hover:text-gold transition-colors"
                        onMouseEnter={() => setShowTooltip('age')}
                        onMouseLeave={() => setShowTooltip(null)}
                        aria-label="Optional field information"
                      >
                        <ExclamationCircleIcon className="w-4 h-4" />
                      </button>
                    </span>
                    <input
                      type="text"
                      {...register('ageDemographics')}
                      placeholder="Kids, teens, adults 25-40..."
                      className={`${inputBase} group-hover:border-gold/50`}
                    />
                    {showTooltip === 'age' && (
                      <div className="absolute z-10 top-0 right-0 mt-8 p-2 bg-charcoal text-silver-light text-xs rounded-lg shadow-lg">
                        Optional: Helps us tailor the menu
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Venue Contact */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light">
                    <PhoneIcon className="w-5 h-5 text-gold" />
                    Venue Contact / On-site Coordinator
                  </span>
                  <input
                    type="text"
                    {...register('venueContact')}
                    placeholder="Name, phone & email"
                    className={`${inputBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Kitchen Facilities */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light">
                    <HomeModernIcon className="w-5 h-5 text-gold" />
                    Kitchen Facilities Available
                  </span>
                  <textarea
                    rows={3}
                    {...register('kitchenFacilities')}
                    placeholder="Ovens, burners, fridge space, prep tables..."
                    className={`${textareaBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Setup Restrictions */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light">
                    <ExclamationCircleIcon className="w-5 h-5 text-gold" />
                    Setup / Teardown Restrictions
                  </span>
                  <textarea
                    rows={3}
                    {...register('setupRestrictions')}
                    placeholder="Earliest access time, must clear by midnight..."
                    className={`${textareaBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-chalk-red/10 rounded-full blur-2xl" />
        </fieldset>
      </div>

      {/* Enhanced navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          aria-label="Go back to service selection"
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={markNA}
            type="button"
            className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-charcoal/60 hover:bg-charcoal text-silver-light/70 hover:text-silver-light font-header border border-silver-dark/30 hover:border-silver-dark/50 transition-all duration-300 hover:scale-105"
            aria-label="Skip this section"
          >
            Skip Section
          </button>

          <button
            onClick={onNext}
            type="button"
            className="group relative flex-1 sm:flex-initial px-8 py-3 rounded-full bg-chalk-red text-silver-light font-header text-lg shadow-xl hover:bg-chalk-red-dark hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            aria-label="Proceed to next step"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Continue</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(-5%, 10%); }
          70% { transform: translate(10%, 5%); }
          90% { transform: translate(5%, -10%); }
        }

        .bg-noise {
          animation: grain 8s steps(1) infinite;
        }
      `}</style>
    </section>
  );
}