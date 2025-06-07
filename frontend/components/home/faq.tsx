"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "What is the Pomodoro Timer?",
      answer: "A tool to help you study in focused 25-minute intervals followed by short breaks."
    },
    {
      question: "How do I borrow or return a physical book?",
      answer: "Visit the library circulation desk with your student ID to borrow books. Returns can be made at the desk or through the book drop available 24/7."
    },
    {
      question: "How does the Pomodoro timer work?",
      answer: "Set a 25-minute timer for focused work, take a 5-minute break, then repeat. After 4 cycles, take a longer 15-30 minute break."
    }
  ];

  return (
    <div className='bg-[#ECE3DA]'>
      <div className="py-16 px-5 font-sans bg-[#ECE3DA] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Image Grid */}
          <div className="hidden lg:block lg:w-2/5 xl:w-1/3">
            <div className="grid grid-cols-2 gap-4 h-fit">
              {/* Large image - spans 2 rows */}
              <div className="row-span-2">
                <Image
                  src="/home/faq1.png"
                  alt="Library bookshelf aisle"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              
              {/* Top right image */}
              <div>
                <Image
                  src="/home/faq2.png"
                  alt="Library shelves"
                  width={200}
                  height={150}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              
              {/* Bottom right image */}
              <div>
                <Image
                  src="/home/faq3.png"
                  alt="Library reading area"
                  width={200}
                  height={150}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            
            </div>
          </div>

          {/* Right FAQ Content */}
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <div className="text-left mb-2">
              <span className="text-sm text-gray-600 font-medium block mb-3">
                ASK QUESTION ～～〉
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                FAQ & Help Center
              </h1>
            </div>
            
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <div className="bg-[#ECE3DA] rounded-2xl border border-gray-200 overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-6 cursor-pointer hover:bg-[#e4d7c9] transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <h2 className="text-lg font-semibold text-gray-800 flex-1">
                      {faq.question}
                    </h2>
                    <span className={`w-10 h-10 ${
                      openFaq === index 
                        ? 'bg-[#796146] text-white' 
                        : 'bg-white border-2 border-gray-300 text-gray-600'
                    } rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}>
                      {openFaq === index ? '∧' : '>'}
                    </span>
                  </div>
                  {openFaq === index && (
                    <div className="px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-600 text-base leading-relaxed mt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;