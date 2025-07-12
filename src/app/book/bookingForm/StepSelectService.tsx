/* app/book/bookingForm/StepSelectService.tsx */
'use client';

import { CheckCircleIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Availability, Service } from './BookingWizard';

/* ---------- helper: premium info modal ---------- */
function InfoButton({ blurb, serviceName }: { blurb: string; serviceName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      <button
        aria-label={`Learn more about ${serviceName}`}
        onClick={() => setOpen(true)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative rounded-full bg-charcoal/80 backdrop-blur-sm p-2 text-gold border border-gold/20 group-hover:scale-110 group-hover:border-gold/40 transition-all duration-300">
            <InformationCircleIcon className="h-5 w-5" />
          </div>
        </div>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md transform animate-slide-up"
          >
            {/* Modal container with chalk texture */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url('/textures/chalk-Menuboard.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              <div className="relative bg-charcoal/95 backdrop-blur-sm p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-header text-2xl text-gold mb-1">Service Details</h3>
                    <p className="text-silver-light/60 text-sm">{serviceName}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-silver-light/10 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6 text-silver-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Content */}
                <p className="text-silver-light/90 leading-relaxed whitespace-pre-line mb-8">
                  {blurb}
                </p>
                
                {/* CTA */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-full bg-gold hover:bg-gold/90 text-charcoal font-header text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- props ---------- */
interface Props {
  availability: Availability[];
  selectedDate: string | undefined;
  selectedService: string | undefined;
  globalServices: Service[];
  loadError: string | null;
  onBack: () => void;
  onNext: () => void;
}

/* ---------- component ---------- */
export default function StepSelectService({
  availability,
  selectedDate,
  selectedService,
  globalServices,
  loadError,
  onBack,
  onNext,
}: Props) {
  const { register } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  /* resolve date status & services list */
  const { status, services } = useMemo(() => {
    if (!selectedDate) return { status: 'OFF' as const, services: [] as Service[] };

    const row = availability.find((a) => a.date === selectedDate);
    const state = (row?.status ?? 'OPEN') as Availability['status'];
    const list = state === 'OPEN' ? (row?.services?.length ? row.services : globalServices) : [];

    return { status: state, services: list };
  }, [availability, selectedDate, globalServices]);

  /* group identical names together */
  const grouped = useMemo(() => {
    return services.reduce((acc, s) => {
      const g = acc.find((x) => x.name === s.name);
      if (g) g.tiers.push(s);
      else acc.push({ name: s.name, image: s.image, blurb: s.blurb, tiers: [s] });
      return acc;
    }, [] as { name: string; image: string; blurb: string; tiers: Service[] }[]);
  }, [services]);

  /* banner logic */
  let banner: string | null = loadError;
  if (!banner) {
    if (!selectedDate) banner = 'Please select a date first.';
    else if (status === 'BOOKED') banner = 'Selected date is already booked — please pick another day.';
    else if (status !== 'OPEN') banner = 'No services available on the selected date — please pick another day.';
    else if (!services.length) banner = 'No services found for this date.';
  }

  /* render */
  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Service selection step"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 2</span>
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
            Select Your Service
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-md mx-auto">
          Choose from our signature bodega experiences. Each service brings authentic NYC flavors to your event.
        </p>
      </header>

      {/* Services or banner */}
      {banner ? (
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url('/textures/chalk-red.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative bg-charcoal/80 backdrop-blur-sm p-8 text-center">
              <p className="text-silver-light/70 text-lg italic">{banner}</p>
            </div>
          </div>
        </div>
      ) : (
        <ul className="space-y-6 max-w-4xl mx-auto">
          {grouped.map((g, index) => (
            <li
              key={g.name}
              className={`transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${100 + index * 100}ms` }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* Background texture */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url('/textures/chalk-Menuboard2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                {/* Content container */}
                <div className="relative bg-charcoal-light/90 backdrop-blur-sm p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image section */}
                    <div className="relative sm:w-48 flex-shrink-0">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                        <Image
                          src={g.image}
                          alt={g.name}
                          width={200}
                          height={200}
                          className="w-full h-48 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                        <div className="absolute top-2 left-2 bg-gold/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <SparklesIcon className="h-4 w-4 text-charcoal inline mr-1" />
                          <span className="text-charcoal text-xs font-semibold">Popular</span>
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1 space-y-4">
                      <div className="relative">
                        <h3 className="font-header text-2xl sm:text-3xl pr-12">
                          <span 
                            className="bg-clip-text text-transparent"
                            style={{
                              backgroundImage: `url('/textures/chalk-gold.png')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            {g.name}
                          </span>
                        </h3>
                        <InfoButton blurb={g.blurb} serviceName={g.name} />
                      </div>
                      
                      <p className="text-silver-light/80 leading-relaxed line-clamp-2">
                        {g.blurb}
                      </p>

                      {/* Pricing tiers */}
                      <div className="space-y-2">
                        <p className="text-sm text-silver-light/60 uppercase tracking-wider">Select Package:</p>
                        <div className="flex flex-wrap gap-3">
                          {g.tiers.map((t) => (
                            <label
                              key={t.id}
                              className={`
                                relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
                                transition-all duration-300 transform hover:scale-105
                                ${selectedService === t.id
                                  ? 'bg-gold text-charcoal shadow-lg scale-105'
                                  : 'bg-charcoal/60 hover:bg-charcoal/80 text-silver-light border border-silver-dark/30'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                value={t.id}
                                {...register('serviceId', { required: true })}
                                className="sr-only"
                              />
                              
                              <div className="flex items-center gap-3">
                                <div className={`
                                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${selectedService === t.id 
                                    ? 'border-charcoal bg-charcoal' 
                                    : 'border-silver-light/50'
                                  }
                                `}>
                                  {selectedService === t.id && (
                                    <CheckCircleIcon className="h-4 w-4 text-gold" />
                                  )}
                                </div>
                                
                                <span className="font-semibold">
                                  {(t.price / 100).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Enhanced navigation */}
      <div className="flex justify-between items-center pt-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          type="button"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-light hover:bg-charcoal text-silver-light font-header shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          aria-label="Go back to date selection"
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
          onClick={onNext}
          type="button"
          disabled={!selectedService}
          className={`
            group relative px-8 py-3 rounded-full font-header text-lg
            ${selectedService 
              ? 'bg-chalk-red text-silver-light shadow-xl hover:bg-chalk-red-dark hover:shadow-2xl hover:scale-105' 
              : 'bg-charcoal-light text-silver-dark cursor-not-allowed opacity-50'
            }
            transition-all duration-300 overflow-hidden
          `}
          aria-label="Proceed to next step"
        >
          <span className="relative z-10 flex items-center gap-2">
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
          {selectedService && (
            <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          )}
        </button>
      </div>

      {/* Selected service summary */}
      {selectedService && (
        <div 
          className="text-center mt-6 animate-fade-in max-w-2xl mx-auto"
          role="status"
          aria-live="polite"
        >
          <p className="text-silver-light/70 text-sm">
            Selected: <span className="text-gold font-semibold">
              {grouped.find(g => g.tiers.some(t => t.id === selectedService))?.name}
            </span>
          </p>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        /* Line clamp for description */
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* Custom scrollbar for service list */
        @media (max-width: 640px) {
          ul::-webkit-scrollbar {
            width: 6px;
          }

          ul::-webkit-scrollbar-track {
            background: rgba(42, 42, 38, 0.5);
            border-radius: 3px;
          }

          ul::-webkit-scrollbar-thumb {
            background: #D4B483;
            border-radius: 3px;
          }

          ul::-webkit-scrollbar-thumb:hover {
            background: #C24032;
          }
        }

        /* Ensure proper layering for modals */
        @supports (backdrop-filter: blur(12px)) {
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
          }
        }
      `}</style>
    </section>
  );
}