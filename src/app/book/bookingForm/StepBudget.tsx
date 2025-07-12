'use client';

import {
  BanknotesIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 5 · Budget & Billing */
export default function StepBudget({ onBack, onNext }: Props) {
  const { register, resetField } = useFormContext<FormValues>();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function markNA() {
    const fields: (keyof FormValues)[] = ['budgetRange', 'billingContact', 'paymentSchedule'];
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

  /** Budget range quick select options */
  const budgetRanges = [
    { value: '$3,000 - $5,000', label: 'Intimate', icon: '✨' },
    { value: '$5,000 - $10,000', label: 'Classic', icon: '🌟' },
    { value: '$10,000 - $20,000', label: 'Premium', icon: '💎' },
    { value: '$20,000+', label: 'Luxury', icon: '👑' },
  ];

  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Budget and billing information"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 5</span>
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
            Budget & Billing
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-2xl mx-auto text-sm sm:text-base">
          Let&apos;s discuss the investment for your perfect bodega experience
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
              <CurrencyDollarIcon className="w-6 h-6" />
              Financial Details
            </legend>

            <div className="space-y-8">
              {/* Budget Range Quick Select */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-header text-silver-light">
                  <BanknotesIcon className="w-5 h-5 text-gold" />
                  Quick Budget Selection
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => {
                        setSelectedBudget(range.value);
                        // You might want to setValue here if using react-hook-form
                      }}
                      className={`
                        relative p-4 rounded-2xl border transition-all duration-300
                        ${selectedBudget === range.value 
                          ? 'border-gold bg-gold/20 shadow-lg shadow-gold/20' 
                          : 'border-silver-dark/30 bg-charcoal/40 hover:border-gold/50 hover:bg-charcoal/60'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{range.icon}</div>
                      <div className="font-header text-sm text-silver-light">{range.label}</div>
                      <div className="text-xs text-silver-light/60 mt-1">{range.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range Input */}
              <div className="group">
                <label className="block">
                  <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-gold" />
                    Custom Budget Range
                  </span>
                  <p className="text-xs text-silver-light/60 mb-2">Or enter your specific budget</p>
                  <input
                    type="text"
                    {...register('budgetRange')}
                    placeholder="$5,000 – $7,500"
                    className={`${inputBase} group-hover:border-gold/50`}
                    defaultValue={selectedBudget}
                  />
                </label>
              </div>

              {/* Billing Contact Section */}
              <div className="space-y-6 p-6 bg-charcoal/40 rounded-2xl border border-silver-dark/20">
                <h3 className="flex items-center gap-2 font-header text-gold">
                  <DocumentTextIcon className="w-5 h-5" />
                  Billing Information
                </h3>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="group">
                    <label className="block">
                      <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                        <UserIcon className="w-5 h-5 text-gold" />
                        Billing Contact
                      </span>
                      <p className="text-xs text-silver-light/60 mb-2">Who should invoices be sent to?</p>
                      <input
                        type="text"
                        {...register('billingContact')}
                        placeholder="Name / email for invoices"
                        className={`${inputBase} group-hover:border-gold/50`}
                      />
                    </label>
                  </div>

                  <div className="group">
                    <label className="block">
                      <span className="flex items-center gap-2 font-header text-silver-light mb-1">
                        <CalendarDaysIcon className="w-5 h-5 text-gold" />
                        Payment Schedule
                      </span>
                      <p className="text-xs text-silver-light/60 mb-2">Preferred payment timeline</p>
                      <textarea
                        rows={3}
                        {...register('paymentSchedule')}
                        placeholder="50% deposit on booking, balance 1 week before event..."
                        className={`${textareaBase} group-hover:border-gold/50`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Options Visual */}
              <div className="flex items-center justify-center gap-4 py-4">
                <CreditCardIcon className="w-8 h-8 text-silver-light/40" />
                <div className="text-xs text-silver-light/60 uppercase tracking-wider">
                  We accept all major payment methods
                </div>
                <BanknotesIcon className="w-8 h-8 text-silver-light/40" />
              </div>

              {/* Pro tip section */}
              <div className="mt-8 p-4 bg-gold/10 rounded-2xl border border-gold/20">
                <p className="text-sm text-gold flex items-start gap-2">
                  <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Booking Tip:</strong> Our packages are customizable to fit your budget. 
                    We&apos;ll work with you to create the perfect menu within your range!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-chalk-red/10 rounded-full blur-3xl animate-pulse-glow" />
        </fieldset>
      </div>

      {/* Enhanced navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          aria-label="Go back to food preferences"
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
                step <= 5 
                  ? 'bg-gold w-8' 
                  : 'bg-silver-dark/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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
          textarea:focus {
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}