import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { AlertCircle, CheckCircle } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../lib/supabaseClient';
import { SurveyFormData, RatingKey } from '../types/survey';

const initialFormData: SurveyFormData = {
  full_name: '',
  contact_number: '',
  date: null,
  age: '',
  likes_pizza: false,
  likes_pasta: false,
  likes_papandwors: false,
  likes_chickenstirfry: false,
  rating_eatout: 0,
  rating_watchmovies: 0,
  rating_watchtv: 0,
  rating_listenradio: 0
};

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof SurveyFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SurveyFormData, string>> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    const age = Number(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 5 || age > 120) {
      newErrors.age = 'Age must be between 5 and 120';
    }
    
    const ratingFields: RatingKey[] = ['rating_eatout', 'rating_watchmovies', 'rating_watchtv', 'rating_listenradio'];
    ratingFields.forEach(field => {
      if (formData[field] === 0) {
        newErrors[field] = 'Please select a rating';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SurveyFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof SurveyFormData]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleRatingChange = (name: RatingKey, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    
    if (!validateForm()) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        full_name: formData.full_name,
        contact_number: formData.contact_number,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null,
        age: Number(formData.age),
        likes_pizza: formData.likes_pizza,
        likes_pasta: formData.likes_pasta,
        likes_papandwors: formData.likes_papandwors,
        likes_chickenstirfry: formData.likes_chickenstirfry,
        rating_eatout: formData.rating_eatout,
        rating_watchmovies: formData.rating_watchmovies,
        rating_watchtv: formData.rating_watchtv,
        rating_listenradio: formData.rating_listenradio
      };
      
      const { error } = await supabase
        .from('surveys')
        .insert([submissionData]);
      
      if (error) {
        throw error;
      }
      
      setFormData(initialFormData);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioButton: React.FC<{
    name: RatingKey;
    value: number;
    label: string;
    checked: boolean;
    onChange: () => void;
  }> = ({ name, value, label, checked, onChange }) => (
    <label className="inline-flex items-center mr-4 cursor-pointer">
      <input
        type="radio"
        className="sr-only"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-5 h-5 rounded-full border ${checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300'} flex items-center justify-center`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </div>
      <span className="ml-2 text-sm">{label}</span>
    </label>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {submitSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Survey Submitted Successfully!</p>
            <p className="text-green-700">Thank you for completing the survey.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fill Out Survey</h2>
        
        {/* Personal Details Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div data-error={!!errors.full_name}>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleTextChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.full_name}
                </p>
              )}
            </div>
            
            {/* Contact Number */}
            <div data-error={!!errors.contact_number}>
              <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleTextChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                  errors.contact_number ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contact_number && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.contact_number}
                </p>
              )}
            </div>
            
            {/* Date */}
            <div data-error={!!errors.date}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholderText="Select date"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </p>
              )}
            </div>
            
            {/* Age */}
            <div data-error={!!errors.age}>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleNumberChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter age (5-120)"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.age}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Food Preferences Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">What is your favourite food? (Choose as many as you want)</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Pizza */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="likes_pizza"
                  checked={formData.likes_pizza}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border ${
                  formData.likes_pizza ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-300'
                } flex items-center justify-center transition-colors`}>
                  {formData.likes_pizza && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Pizza</span>
              </label>
              
              {/* Pasta */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="likes_pasta"
                  checked={formData.likes_pasta}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border ${
                  formData.likes_pasta ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-300'
                } flex items-center justify-center transition-colors`}>
                  {formData.likes_pasta && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Pasta</span>
              </label>
              
              {/* Pap and Wors */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="likes_papandwors"
                  checked={formData.likes_papandwors}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border ${
                  formData.likes_papandwors ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-300'
                } flex items-center justify-center transition-colors`}>
                  {formData.likes_papandwors && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Pap and Wors</span>
              </label>
              
              {/* Chicken Stir Fry */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="likes_chickenstirfry"
                  checked={formData.likes_chickenstirfry}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border ${
                  formData.likes_chickenstirfry ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-300'
                } flex items-center justify-center transition-colors`}>
                  {formData.likes_chickenstirfry && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Chicken Stir Fry</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Ratings Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">On a scale of 1 to 5, indicate how much you enjoy the following:</h3>
          
          <div className="space-y-6">
            {/* Eat Out Rating */}
            <div data-error={!!errors.rating_eatout}>
              <p className="text-sm font-medium text-gray-700 mb-2">I like to eat out</p>
              <div className="flex flex-wrap items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <RadioButton
                    key={`eatout-${value}`}
                    name="rating_eatout"
                    value={value}
                    label={value.toString()}
                    checked={formData.rating_eatout === value}
                    onChange={() => handleRatingChange('rating_eatout', value)}
                  />
                ))}
              </div>
              {errors.rating_eatout && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating_eatout}
                </p>
              )}
            </div>
            
            {/* Watch Movies Rating */}
            <div data-error={!!errors.rating_watchmovies}>
              <p className="text-sm font-medium text-gray-700 mb-2">I like to watch movies</p>
              <div className="flex flex-wrap items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <RadioButton
                    key={`watchmovies-${value}`}
                    name="rating_watchmovies"
                    value={value}
                    label={value.toString()}
                    checked={formData.rating_watchmovies === value}
                    onChange={() => handleRatingChange('rating_watchmovies', value)}
                  />
                ))}
              </div>
              {errors.rating_watchmovies && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating_watchmovies}
                </p>
              )}
            </div>
            
            {/* Watch TV Rating */}
            <div data-error={!!errors.rating_watchtv}>
              <p className="text-sm font-medium text-gray-700 mb-2">I like to watch TV</p>
              <div className="flex flex-wrap items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <RadioButton
                    key={`watchtv-${value}`}
                    name="rating_watchtv"
                    value={value}
                    label={value.toString()}
                    checked={formData.rating_watchtv === value}
                    onChange={() => handleRatingChange('rating_watchtv', value)}
                  />
                ))}
              </div>
              {errors.rating_watchtv && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating_watchtv}
                </p>
              )}
            </div>
            
            {/* Listen to Radio Rating */}
            <div data-error={!!errors.rating_listenradio}>
              <p className="text-sm font-medium text-gray-700 mb-2">I like to listen to the radio</p>
              <div className="flex flex-wrap items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <RadioButton
                    key={`listenradio-${value}`}
                    name="rating_listenradio"
                    value={value}
                    label={value.toString()}
                    checked={formData.rating_listenradio === value}
                    onChange={() => handleRatingChange('rating_listenradio', value)}
                  />
                ))}
              </div>
              {errors.rating_listenradio && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rating_listenradio}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;