'use client';

import {
  BeakerIcon,
  CakeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 4 · Food & Service Preferences */
export default function StepFood({ onBack, onNext }: Props) {
  const { register, resetField, } = useFormContext<FormValues>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function markNA() {
    const fields: (keyof FormValues)[] = [
      'cuisineStyles',
      'mealType',
      'menuIdeas',
      'dietaryRestrictions',
      'beverageNeeds',
      'serviceStyleDetails',
      'staffingLevel',
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

  const textareaBase = `${inputBase} resize-none`;
  const selectBase = `${inputBase} cursor-pointer`;

  const mealTypes = [
    { value: '', label: 'Select meal type...' },
    { value: 'passed-appetizers', label: '🍢 Passed Appetizers' },
    { value: 'buffet', label: '🍽️ Buffet Style' },
    { value: 'plated-dinner', label: '🍷 Plated Dinner' },
    { value: 'food-stations', label: '🍕 Food Stations' },
    { value: 'family-style', label: '👨‍👩‍👧‍👦 Family Style' },
    { value: 'cocktail-party', label: '🍸 Cocktail Party' },
    { value: 'brunch', label: '🥞 Brunch Service' },
  ];

  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Food and service preferences"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 4</span>
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
            Food & Service
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-2xl mx-auto text-sm sm:text-base">
          Tell us about your culinary vision and service preferences for your event
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
              <CakeIcon className="w-6 h-6" />
              Culinary Preferences
            </legend>

            <div className="space-y-6">
              {/* Cuisine Styles */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <SparklesIcon className="w-5 h-5 text-gold" />
                    Cuisine Styles
                  </span>
                  <p className="text-xs text-silver-light/60 mb-2">What flavors inspire your event?</p>
                  <input
                    type="text"
                    {...register('cuisineStyles')}
                    placeholder="Italian, BBQ, Asian fusion, Southern comfort..."
                    className={`${inputBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Meal Type - Enhanced Select */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-gold" />
                    Service Style
                  </span>
                  <p className="text-xs text-silver-light/60 mb-2">How would you like the food served?</p>
                  <select 
                    {...register('mealType')} 
                    className={`${selectBase} group-hover:border-gold/50`}
                  >
                    {mealTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Menu Ideas - Two column on desktop */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <CakeIcon className="w-5 h-5 text-gold" />
                      Menu Ideas
                    </span>
                    <p className="text-xs text-silver-light/60 mb-2">Share your vision</p>
                    <textarea
                      rows={4}
                      {...register('menuIdeas')}
                      placeholder="Favorite dishes, seasonal ingredients, family recipes, must-have items..."
                      className={`${textareaBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <ExclamationTriangleIcon className="w-5 h-5 text-gold" />
                      Dietary Restrictions
                    </span>
                    <p className="text-xs text-silver-light/60 mb-2">Important for guest safety</p>
                    <textarea
                      rows={4}
                      {...register('dietaryRestrictions')}
                      placeholder="Vegetarian (5), Vegan (2), Gluten-free (3), Nut allergies, Kosher..."
                      className={`${textareaBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>
              </div>

              {/* Beverage Section */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <BeakerIcon className="w-5 h-5 text-gold" />
                    Beverage Service
                  </span>
                  <p className="text-xs text-silver-light/60 mb-2">Bar service and drink preferences</p>
                  <textarea
                    rows={3}
                    {...register('beverageNeeds')}
                    placeholder="Full bar, beer & wine only, signature cocktails, mocktails, coffee service..."
                    className={`${textareaBase} group-hover:border-gold/50`}
                  />
                </label>
              </div>

              {/* Service Details & Staffing - Two column on desktop */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <HandRaisedIcon className="w-5 h-5 text-gold" />
                      Service Details
                    </span>
                    <p className="text-xs text-silver-light/60 mb-2">Timing and flow</p>
                    <textarea
                      rows={3}
                      {...register('serviceStyleDetails')}
                      placeholder="Cocktail hour at 6pm, dinner at 7pm, dessert stations..."
                      className={`${textareaBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>

                <div className="group">
                  <label className="block">
                    <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                      <UserGroupIcon className="w-5 h-5 text-gold" />
                      Staffing Preferences
                    </span>
                    <p className="text-xs text-silver-light/60 mb-2">Service level desired</p>
                    <input
                      type="text"
                      {...register('staffingLevel')}
                      placeholder="1 server per 15 guests, 2 bartenders, chef stations..."
                      className={`${inputBase} group-hover:border-gold/50`}
                    />
                  </label>
                </div>
              </div>

              {/* Pro tip section */}
              <div className="mt-8 p-4 bg-gold/10 rounded-2xl border border-gold/20">
                <p className="text-sm text-gold flex items-start gap-2">
                  <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Chef&apos;s Tip:</strong> Our bodega-style service works great with food stations 
                    and passed apps. We can customize any menu to match your vision!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-chalk-red/10 rounded-full blur-3xl" />
        </fieldset>
      </div>

      {/* Enhanced navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          aria-label="Go back to logistics"
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

      {/* Progress indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step <= 4 
                  ? 'bg-gold w-8' 
                  : 'bg-silver-dark/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Add hover animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Custom select dropdown styling */
        select option {
          background-color: #1B1B18;
          color: #F5F1E6;
          padding: 0.5rem;
        }

        select option:hover {
          background-color: #2A2A26;
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
          
          input:focus,
          textarea:focus,
          select:focus {
            transform: scale(1.02);
          }
        }

        /* Ensure proper stacking on mobile */
        @media (max-width: 640px) {
          .group:focus-within {
            z-index: 10;
          }
        }
      `}</style>
    </section>
  );
}