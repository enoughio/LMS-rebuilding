'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import {  FacebookIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });

    alert('Message sent successfully!');
  };

  return (
   
      <div className=" max-w-[1920px] lg:overflow-x-auto w-full px-4  sm:px-6 lg:px-20 pb-20 bg-[#ECE3DA] pt-5">



        {/* Main Content with Hero and Social Media Icons */}
        <div className="flex flex-col md:flex-row justify-between mb-12 px-12">
          {/* Hero Text */}
          <div className="w-full md:w-3/4 mb-8 md:mb-0">
            <div className="text-sm mb-2 md:text-lg">
              Get Started
            </div>
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 flex flex-col gap-4">
             <p className='text-nowrap'>Get in touch with us.</p>
              We are here to  <br className="hidden text-nowrap sm:block" />assist you.
            </h1>
          </div>

          {/* Social Media Icons */}
          <div className="flex md:flex-col md:items-center space-x-4 md:space-x-0 md:space-y-4">
            {/* Face Icon */}
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border-2 border-[#B7B7B7] rounded-full overflow-hidden">
              {/* <Image src="/home/face.png" alt="Social 1" width={14} height={14} className="w-4 h-4 filter grayscale brightness-0 object-cover" /> */}
              <FacebookIcon className="w-4 h-4 filter grayscale brightness-0" />
            </div>

            {/* Tweet Icon */}
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border-2 border-[#B7B7B7] rounded-full overflow-hidden">
              {/* <Image src="/home/tweet.png" alt="Social 2"  width={14} height={14} className="w-4 h-4 filter grayscale brightness-0 object-cover" /> */}
              <TwitterIcon className="w-4 h-4 filter grayscale brightness-0" />
            </div>

            {/* LinkedIn Icon */}
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border-2 border-[#B7B7B7] rounded-full overflow-hidden">
              {/* <Image src="/home/linked.png" alt="Social 3"  width={14} height={14} className="w-4 h-4 filter grayscale brightness-0 object-cover" /> */}
              <LinkedinIcon className="w-4 h-4 filter grayscale brightness-0" />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-5/6 px-10">
          <form onSubmit={handleSubmit} className="mb-12">
            {/* Name, Email, and Phone - Responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="w-full">
                <label htmlFor="name" className="block text-sm mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#ECE3DA] border-b border-gray-400 pb-2 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#ECE3DA] border-b border-gray-400 pb-2 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="phone" className="block text-sm mb-1">Phone Number (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#ECE3DA] border-b border-gray-400 pb-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Message input on a new line */}
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm mb-1">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[#ECE3DA] border rounded-md border-gray-400 pb-2 h-20 focus:outline-none focus:border-black resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-black text-white rounded-full px-6 py-3 flex items-center text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Leave us a Message
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Contact Info - Responsive layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between p-10 border-y border-gray-600 ">
          <div className="mb-10 lg:mb-0 lg:w-1/2">
            <h2 className="text-lg font-normal mb-3">
              Contact Info
            </h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              We are always happy<br className="hidden sm:block" /> to assist you
            </p>
          </div>

          {/* Contact details - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:w-1/2">
            {/* Email Section */}
            <div className="mb-6">
              <div className="text-sm font-extrabold mb-2">Email Address</div>
              <div className="h-1 w-16 bg-black mb-3"></div>
              <div className="text-sm font-bold text-gray-800 mb-4">help@info.com</div>
              <div className="text-xs text-gray-600">
                Assistance hours:<br />
                Monday - Friday 9 am to<br />
                8 pm EST
              </div>
            </div>

            {/* Phone Section */}
            <div className="mb-6">
              <div className="text-sm font-extrabold mb-2">Number</div>
              <div className="h-1 w-16 bg-black mb-3"></div>
              <div className="text-sm font-bold text-gray-800 mb-4">(808) 098-34256</div>
              <div className="text-xs text-gray-600">
                Assistance hours:<br />
                Monday - Friday 9 am to<br />
                8 pm EST
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}