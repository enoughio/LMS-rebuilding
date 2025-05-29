'use client'
import { useState } from 'react'

export default function Tracking() {
  const [selectedStep, setSelectedStep] = useState(1);
  
  const getLabel = (step) => {
    if (step === 1) return 'Choose Seat';
    if (step === 2) return 'Booking Details';
    return 'Payment';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Desktop and Tablet View */}
      <div className="hidden sm:flex items-center justify-between w-full relative">
        {/* Background Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-[#824800] transition-all duration-300 z-0"
          style={{ 
            width: selectedStep === 1 ? '0%' : 
                  selectedStep === 2 ? '50%' : '100%'
          }}
        ></div>
        
        {/* Steps */}
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center z-10 w-1/3">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                selectedStep >= step ? 'bg-[#824800] text-white' : 'bg-gray-200 text-gray-500'
              }`}
              onClick={() => {
                if (step === 1 || selectedStep >= step - 1) {
                  setSelectedStep(step);
                }
              }}
            >
              {step}
            </button>
            <p
              className={`mt-2 font-semibold text-center text-sm md:text-base lg:text-lg ${
                selectedStep >= step ? 'text-[#824800]' : 'text-gray-500'
              }`}
            >
              {getLabel(step)}
            </p>
          </div>
        ))}
      </div>
      
      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-6 relative">
          {/* Background Progress Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-[#824800] transition-all duration-300 z-0"
            style={{ 
              width: selectedStep === 1 ? '0%' : 
                    selectedStep === 2 ? '50%' : '100%'
            }}
          ></div>
          
          {/* Steps */}
          {[1, 2, 3].map((step) => (
            <div key={step} className="z-10 flex flex-col items-center">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  selectedStep >= step ? 'bg-[#824800] text-white' : 'bg-gray-200 text-gray-500'
                }`}
                onClick={() => {
                  if (step === 1 || selectedStep >= step - 1) {
                    setSelectedStep(step);
                  }
                }}
              >
                {step}
              </button>
              <p
                className={`mt-2 text-xs font-semibold ${
                  selectedStep >= step ? 'text-[#824800]' : 'text-gray-500'
                }`}
              >
                {getLabel(step)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}