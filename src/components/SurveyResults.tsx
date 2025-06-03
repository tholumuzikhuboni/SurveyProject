import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SurveyStats } from '../types/survey';
import { BarChart, User, UserCheck, UserX, Pizza } from 'lucide-react';

const SurveyResults: React.FC = () => {
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        setLoading(true);
        
        const { data: surveys, error } = await supabase
          .from('surveys')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (!surveys || surveys.length === 0) {
          setStats(null);
          return;
        }
        
        const totalSurveys = surveys.length;
        
        const ages = surveys.map(survey => survey.age);
        const averageAge = ages.reduce((sum, age) => sum + age, 0) / totalSurveys;
        const oldestPerson = Math.max(...ages);
        const youngestPerson = Math.min(...ages);
        
        const pizzaLovers = surveys.filter(survey => survey.likes_pizza).length;
        const percentagePizzaLovers = (pizzaLovers / totalSurveys) * 100;
        
        const eatOutRatings = surveys.map(survey => survey.rating_eatout);
        const averageEatOutRating = eatOutRatings.reduce((sum, rating) => sum + rating, 0) / totalSurveys;
        
        setStats({
          totalSurveys,
          averageAge,
          oldestPerson,
          youngestPerson,
          percentagePizzaLovers,
          averageEatOutRating
        });
      } catch (error) {
        console.error('Error fetching survey results:', error);
        setError('Failed to load survey results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveyResults();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-gray-600">Loading survey results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <BarChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Surveys Available</h2>
          <p className="text-gray-600">
            No survey data has been collected yet. Please complete a survey to see results.
          </p>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${color} transition-transform duration-300 hover:transform hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border', 'bg').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Survey Results</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Surveys" 
            value={stats.totalSurveys} 
            icon={<UserCheck className="w-6 h-6 text-indigo-500" />} 
            color="border-indigo-500" 
          />
          
          <StatCard 
            title="Average Age" 
            value={stats.averageAge.toFixed(1)} 
            icon={<User className="w-6 h-6 text-teal-500" />} 
            color="border-teal-500" 
          />
          
          <StatCard 
            title="Oldest Person" 
            value={stats.oldestPerson} 
            icon={<UserX className="w-6 h-6 text-amber-500" />} 
            color="border-amber-500" 
          />
          
          <StatCard 
            title="Youngest Person" 
            value={stats.youngestPerson} 
            icon={<UserX className="w-6 h-6 text-emerald-500" />} 
            color="border-emerald-500" 
          />
          
          <StatCard 
            title="Pizza Lovers" 
            value={`${stats.percentagePizzaLovers.toFixed(1)}%`} 
            icon={<Pizza className="w-6 h-6 text-red-500" />} 
            color="border-red-500" 
          />
          
          <StatCard 
            title="Enjoy Eating Out" 
            value={stats.averageEatOutRating.toFixed(1)} 
            icon={<BarChart className="w-6 h-6 text-purple-500" />} 
            color="border-purple-500" 
          />
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary</h3>
          <p className="text-gray-600 leading-relaxed">
            Based on {stats.totalSurveys} completed surveys, the average participant age is {stats.averageAge.toFixed(1)} years,
            with ages ranging from {stats.youngestPerson} to {stats.oldestPerson} years.
            {stats.percentagePizzaLovers.toFixed(1)}% of participants enjoy pizza, and the average rating for enjoying eating out is {stats.averageEatOutRating.toFixed(1)} out of 5.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;