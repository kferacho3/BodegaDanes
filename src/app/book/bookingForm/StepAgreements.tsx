'use client';

import {
  CheckCircleIcon,
  DocumentTextIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  isValid: boolean;
  onBack: () => void;
}

export default function StepAgreements({ isValid, onBack }: Props) {
  const { register, watch } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredAgreement, setHoveredAgreement] = useState<string | null>(null);

  const tosChecked = watch('tos');
  const uaChecked = watch('ua');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Legal agreements"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 7</span>
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
            Legal Agreements
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-2xl mx-auto text-sm sm:text-base">
          Please review and accept our terms to complete your booking
        </p>
      </header>

      {/* Main form container */}
      <div className="max-w-3xl mx-auto">
        <div 
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
            <div className="flex items-center gap-2 font-header text-gold text-xl sm:text-2xl mb-8">
              <ShieldCheckIcon className="w-6 h-6" />
              <span>Terms & Conditions</span>
            </div>

            <div className="space-y-6">
              {/* Terms of Service */}
              <label 
                className={`
                  group relative flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                  ${tosChecked 
                    ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10' 
                    : 'bg-charcoal/40 border-silver-dark/30 hover:border-gold/50 hover:bg-charcoal/60'
                  }
                `}
                onMouseEnter={() => setHoveredAgreement('tos')}
                onMouseLeave={() => setHoveredAgreement(null)}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    {...register('tos', { required: true })}
                    className="peer sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center
                    ${tosChecked 
                      ? 'bg-gold border-gold' 
                      : 'border-silver-light/50 group-hover:border-gold/50'
                    }
                  `}>
                    {tosChecked && (
                      <CheckCircleIcon className="w-4 h-4 text-charcoal animate-scale-in" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gold" />
                    <span className="font-header text-silver-light">Terms of Service</span>
                  </div>
                  <p className="text-sm text-silver-light/70 mb-2">
                    I agree to The Bodega&apos;s terms governing service, payment, and event policies.
                  </p>
                  <a 
                    href="/legal/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="underline">Read Terms of Service</span>
                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {hoveredAgreement === 'tos' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                )}
              </label>

              {/* User Agreement */}
              <label 
                className={`
                  group relative flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                  ${uaChecked 
                    ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10' 
                    : 'bg-charcoal/40 border-silver-dark/30 hover:border-gold/50 hover:bg-charcoal/60'
                  }
                `}
                onMouseEnter={() => setHoveredAgreement('ua')}
                onMouseLeave={() => setHoveredAgreement(null)}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    {...register('ua', { required: true })}
                    className="peer sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center
                    ${uaChecked 
                      ? 'bg-gold border-gold' 
                      : 'border-silver-light/50 group-hover:border-gold/50'
                    }
                  `}>
                    {uaChecked && (
                      <CheckCircleIcon className="w-4 h-4 text-charcoal animate-scale-in" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-gold" />
                    <span className="font-header text-silver-light">User Agreement</span>
                  </div>
                  <p className="text-sm text-silver-light/70 mb-2">
                    I accept the agreement outlining my rights and responsibilities as a client.
                  </p>
                  <a 
                    href="/legal/user-agreement" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="underline">Read User Agreement</span>
                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {hoveredAgreement === 'ua' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                )}
              </label>

              {/* Security & Trust badges */}
              <div className="mt-8 p-4 bg-gold/5 rounded-2xl border border-gold/10">
                <div className="flex items-center justify-center gap-6 text-silver-light/60">
                  <div className="flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5" />
                    <span className="text-xs">Secure Booking</span>
                  </div>
                  <div className="h-4 w-px bg-silver-dark/30" />
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-xs">Protected Payment</span>
                  </div>
                  <div className="h-4 w-px bg-silver-dark/30" />
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="text-xs">Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-chalk-red/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Enhanced navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 max-w-3xl mx-auto">
        <button
          onClick={onBack}
          type="button"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          aria-label="Go back to previous step"
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

        <button
          type="submit"
          disabled={!isValid}
          className={`
            group relative px-8 py-4 rounded-full font-header text-lg shadow-xl transition-all duration-300 overflow-hidden
            ${isValid 
              ? 'bg-chalk-red text-silver-light hover:bg-chalk-red-dark hover:shadow-2xl hover:scale-105' 
              : 'bg-charcoal/60 text-silver-light/40 cursor-not-allowed'
            }
          `}
          aria-label="Complete booking and proceed to payment"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <LockClosedIcon className="w-5 h-5" />
            <span>Pay & Reserve</span>
          </span>
          {isValid && (
            <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          )}
        </button>
      </div>

      {/* Progress indicator - All steps complete */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className="w-8 h-2 rounded-full bg-gold transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        /* Checkbox focus styles */
        input[type="checkbox"]:focus-visible + div {
          outline: 2px solid #D4B483;
          outline-offset: 2px;
        }

        /* Mobile-specific touch feedback */
        @media (max-width: 640px) {
          button:active {
            transform: scale(0.98);
          }
          
          label:active {
            transform: scale(0.99);
          }
        }

        /* Smooth checkbox transitions */
        @keyframes checkbox-check {
          0% {
            transform: scale(0) rotate(45deg);
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(45deg);
          }
        }

        /* Hover glow effect */
        @keyframes hover-glow {
          0% {
            box-shadow: 0 0 5px rgba(212, 180, 131, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(212, 180, 131, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(212, 180, 131, 0.5);
          }
        }

        /* Final CTA button pulse */
        @keyframes cta-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(194, 64, 50, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(194, 64, 50, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(194, 64, 50, 0);
          }
        }

        button[type="submit"]:not(:disabled) {
          animation: cta-pulse 2s infinite;
        }

        button[type="submit"]:not(:disabled):hover {
          animation: none;
        }

        /* Ensure proper stacking on mobile */
        @media (max-width: 640px) {
          label:focus-within {
            z-index: 10;
          }
        }

        /* Custom link hover underline animation */
        a span {
          position: relative;
        }

        a span::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #D4B483;
          transition: width 0.3s ease;
        }

        a:hover span::after {
          width: 100%;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .border-silver-dark\/30 {
            border-color: #F5F1E6;
          }
          
          .text-silver-light\/70 {
            color: #F5F1E6;
          }
        }
      `}</style>
    </section>
  );
}