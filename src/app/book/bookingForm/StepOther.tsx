'use client';

import {
  CalendarIcon,
  CircleStackIcon,
  DocumentCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  TrashIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 6 · Other Useful Information */
export default function StepOther({ onBack, onNext }: Props) {
  const { register, resetField } = useFormContext<FormValues>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function markNA() {
    const fields: (keyof FormValues)[] = [
      'eventTimeline',
      'culturalConsiderations',
      'equipmentNeeds',
      'wastePlan',
    ];
    fields.forEach((f) => resetField(f));
    onNext();
  }

  /** Enhanced input styles */
  const textareaBase = `
    mt-2 w-full rounded-2xl border border-silver-dark/30 
    bg-charcoal/40 backdrop-blur-sm px-4 py-3 
    text-silver-light placeholder-silver-light/40
    focus:border-gold focus:ring-2 focus:ring-gold/30 focus:bg-charcoal/60
    transition-all duration-300
    font-body text-base
    resize-none
  `;

  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Additional event information"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 6</span>
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
            Additional Details
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-2xl mx-auto text-sm sm:text-base">
          Any special considerations that will help us create your perfect event
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
              <DocumentCheckIcon className="w-6 h-6" />
              Final Considerations
            </legend>

            <div className="space-y-8">
              {/* Event Timeline - Feature Box */}
              <div className="group relative overflow-hidden rounded-2xl bg-charcoal/40 p-6 border border-silver-dark/20 hover:border-gold/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all duration-300" />
                
                <label className="block relative">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <CalendarIcon className="w-5 h-5 text-gold" />
                    Event Flow / Timeline
                  </span>
                  <p className="text-xs text-silver-light/60 mb-3">Help us understand your event&apos;s key moments</p>
                  <textarea
                    rows={3}
                    {...register('eventTimeline')}
                    placeholder="Guests arrive 5pm, cocktail hour 5:30–6:30, dinner service at 7pm, speeches at 8pm..."
                    className={`${textareaBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Cultural & Equipment Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Cultural Considerations */}
                <div className="group relative overflow-hidden rounded-2xl bg-charcoal/40 p-6 border border-silver-dark/20 hover:border-gold/30 transition-all duration-300">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <GlobeAltIcon className="w-5 h-5 text-gold" />
                      Cultural Considerations
                    </span>
                    <p className="text-xs text-silver-light/60 mb-3">Religious, dietary, or cultural needs</p>
                    <textarea
                      rows={4}
                      {...register('culturalConsiderations')}
                      placeholder="Halal requirements, Kosher preparation, vegetarian Friday, cultural customs..."
                      className={`${textareaBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                {/* Equipment Needs */}
                <div className="group relative overflow-hidden rounded-2xl bg-charcoal/40 p-6 border border-silver-dark/20 hover:border-gold/30 transition-all duration-300">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-gold" />
                      Equipment & Rentals
                    </span>
                    <p className="text-xs text-silver-light/60 mb-3">Tables, linens, serving equipment</p>
                    <textarea
                      rows={4}
                      {...register('equipmentNeeds')}
                      placeholder="8-top round tables, ivory linens, gold chargers, warming stations..."
                      className={`${textareaBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>
              </div>

              {/* Waste Management - Feature Box */}
              <div className="group relative overflow-hidden rounded-2xl bg-charcoal/40 p-6 border border-silver-dark/20 hover:border-gold/30 transition-all duration-300">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-chalk-red/5 rounded-full blur-3xl group-hover:bg-chalk-red/10 transition-all duration-300" />
                
                <label className="block relative">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <TrashIcon className="w-5 h-5 text-gold" />
                    Waste Management Plan
                  </span>
                  <p className="text-xs text-silver-light/60 mb-3">Disposal and sustainability preferences</p>
                  <textarea
                    rows={3}
                    {...register('wastePlan')}
                    placeholder="Venue dumpster access, compost bins available, recycling requirements, haul-away service needed..."
                    className={`${textareaBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Sustainability Note */}
              <div className="flex items-center gap-3 p-4 bg-gold/10 rounded-2xl border border-gold/20">
                <CircleStackIcon className="w-8 h-8 text-gold flex-shrink-0" />
                <div className="text-sm text-gold">
                  <strong>Eco-Friendly Options:</strong> Ask about our sustainable service options including 
                  compostable serviceware and locally-sourced ingredients!
                </div>
              </div>

              {/* Pro tip section */}
              <div className="mt-8 p-4 bg-silver-dark/20 rounded-2xl border border-silver-dark/30">
                <p className="text-sm text-silver-light flex items-start gap-2">
                  <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> The more details you share, the better we can customize 
                    your bodega experience. Don&apos;t worry if you don&apos;t have all the answers yet!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-chalk-red/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </fieldset>
      </div>

      {/* Enhanced navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          aria-label="Go back to budget"
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
            aria-label="Proceed to final step"
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

      {/* Progress indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step <= 6 
                  ? 'bg-gold w-8' 
                  : 'bg-silver-dark/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Textarea custom scrollbar */
        textarea::-webkit-scrollbar {
          width: 6px;
        }

        textarea::-webkit-scrollbar-track {
          background: rgba(42, 42, 38, 0.5);
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #D4B483;
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: #C24032;
        }

        /* Mobile-specific touch feedback */
        @media (max-width: 640px) {
          button:active {
            transform: scale(0.98);
          }
          
          textarea:focus {
            transform: scale(1.02);
          }
        }

        /* Special hover effects for feature boxes */
        .group:hover {
          transform: translateY(-2px);
        }

        /* Ensure proper stacking on mobile */
        @media (max-width: 640px) {
          .group:focus-within {
            z-index: 10;
          }
        }

        /* Gradient text shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .text-shimmer {
          background: linear-gradient(
            90deg,
            #D4B483 0%,
            #F5F1E6 50%,
            #D4B483 100%
          );
          background-size: 200% auto;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}