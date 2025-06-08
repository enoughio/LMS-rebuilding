'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext'; 
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LibraryFormData {
  // Library Information
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  images: File[]; // Changed to File array for actual file uploads
  amenities: string[];
  totalSeats: number;
  additionalInformation?: string;
  
  // Admin Information
  adminBio?: string;
  adminCompleteAddress: string;
  adminPhone: string;
  adminGovernmentId?: string; // Will store file URL after upload
  adminPhoto?: string; // Will store file URL after upload
  
  // Opening Hours
  openingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const COMMON_AMENITIES = [
  'WiFi', 'Study Rooms', 'Computer Lab', 'Printing Services', 
  'Parking', 'Cafeteria', 'Air Conditioning', 'Security',
  'Power Outlets', 'Lockers', 'Quiet Zone', 'Group Study Area'
];

export default function LibraryRegistrationForm() {
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftKey, setDraftKey] = useState<string>('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<LibraryFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    email: '',
    phone: '',
    images: [], 
    amenities: [],
    totalSeats: 0,
    additionalInformation: '',
    adminBio: '',
    adminCompleteAddress: '',
    adminPhone: '',
    adminGovernmentId: '',
    adminPhoto: '',
    openingHours: DAYS_OF_WEEK.map((_, index) => ({
      dayOfWeek: index,
      openTime: '09:00',
      closeTime: '18:00',
      isClosed: false
    }))
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft on component mount
  useEffect(() => {
    if (user?.id) {
      const key = `library_registration_draft_${user.id}`;
      setDraftKey(key);
      
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setFormData(parsedDraft);
          toast.success('Draft loaded successfully!');
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }  }, [user]);

  const saveDraft = useCallback(async () => {
    if (!draftKey) return;
    
    setIsSavingDraft(true);
    try {
      // Create a copy without File objects for localStorage
      const draftData = {
        ...formData,
        images: [], // Don't save file objects
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      toast.success('Draft saved!', { duration: 2000 });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  }, [draftKey, formData]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!draftKey) return;

    const autoSaveInterval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData, draftKey, saveDraft]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }  }, [user, userLoading, router]);

  const clearDraft = () => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Library name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.adminCompleteAddress.trim()) newErrors.adminCompleteAddress = 'Admin address is required';
    if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Admin phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!phoneRegex.test(formData.adminPhone)) {
      newErrors.adminPhone = 'Please enter a valid admin phone number';
    }

    // Total seats validation
    if (formData.totalSeats <= 0) {
      newErrors.totalSeats = 'Total seats must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({ ...prev, images: validFiles }));

    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Clean up preview URLs
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Updated submit handler for FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add basic form fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('state', formData.state.trim());
      formDataToSend.append('country', formData.country.trim());
      formDataToSend.append('postalCode', formData.postalCode.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('totalSeats', formData.totalSeats.toString());
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formDataToSend.append('additionalInformation', formData.additionalInformation || '');
      
      // Add admin info
      formDataToSend.append('adminBio', formData.adminBio || '');
      formDataToSend.append('adminCompleteAddress', formData.adminCompleteAddress.trim());
      formDataToSend.append('adminPhone', formData.adminPhone.trim());
      formDataToSend.append('adminGovernmentId', formData.adminGovernmentId || '');
      formDataToSend.append('adminPhoto', formData.adminPhoto || '');
      
      // Add opening hours
      formDataToSend.append('openingHours', JSON.stringify(formData.openingHours));
      
      // Add image files
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch('/api/libraries/register', {
        method: 'POST',
        body: formDataToSend, 
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Library registration submitted successfully! Please wait for admin approval.');
        clearDraft();
        router.push('/dashboard');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | string[] | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOpeningHourChange = (
    dayIndex: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((hour, index) =>
        index === dayIndex ? { ...hour, [field]: value } : hour
      )
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEAE5] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register Your Library
            </h1>
            <p className="text-gray-600">
              Fill out this form to register your library on our platform. 
              Your submission will be reviewed by our admin team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Library Information Section */}
            <div className="bg-[#EFEAE5] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📚 Library Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Library Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border bg-[#EFEAE5]/60 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter library name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="library@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your library..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Street address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Country"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Postal code"
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) => handleInputChange('totalSeats', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.totalSeats ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of seats"
                  />
                  {errors.totalSeats && <p className="text-red-500 text-sm mt-1">{errors.totalSeats}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {COMMON_AMENITIES.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="rounded text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInformation}
                    onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Any additional information about your library..."
                  />
                </div>

                {/* Library Images Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Library Images (Max 4 images)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Select up to 4 images. Maximum 10MB per image. Supported formats: JPG, PNG, GIF
                  </p>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Library preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Information Section */}
            <div className=" p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                👤 Admin (Owner) Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.adminPhone}
                    onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.adminPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {errors.adminPhone && <p className="text-red-500 text-sm mt-1">{errors.adminPhone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    value={formData.adminCompleteAddress}
                    onChange={(e) => handleInputChange('adminCompleteAddress', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      errors.adminCompleteAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Complete residential address"
                  />
                  {errors.adminCompleteAddress && <p className="text-red-500 text-sm mt-1">{errors.adminCompleteAddress}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={formData.adminBio}
                    onChange={(e) => handleInputChange('adminBio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            <div className=" p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                🕒 Opening Hours
              </h2>
              
              <div className="space-y-4">
                {formData.openingHours.map((hour, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="text-sm font-medium text-gray-700">
                        {DAYS_OF_WEEK[index]}
                      </span>
                    </div>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hour.isClosed}
                        onChange={(e) => handleOpeningHourChange(index, 'isClosed', e.target.checked)}
                        className="rounded text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Closed</span>
                    </label>
                    
                    {!hour.isClosed && (
                      <>
                        <input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) => handleOpeningHourChange(index, 'openTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => handleOpeningHourChange(index, 'closeTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSavingDraft}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? 'Saving Draft...' : 'Save Draft'}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}