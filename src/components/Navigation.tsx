import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, BarChart2 } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <ClipboardList className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Lifestyle Survey</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-white text-white' 
                      : 'border-transparent text-teal-100 hover:text-white hover:border-teal-300'
                  }`
                }
              >
                <ClipboardList className="h-4 w-4 mr-1" />
                Fill Out Survey
              </NavLink>
              
              <NavLink 
                to="/results" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-white text-white' 
                      : 'border-transparent text-teal-100 hover:text-white hover:border-teal-300'
                  }`
                }
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                View Survey Results
              </NavLink>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <div className="flex space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-teal-700 text-white' 
                      : 'text-teal-100 hover:bg-teal-500 hover:text-white'
                  }`
                }
              >
                <ClipboardList className="h-4 w-4 inline mr-1" />
                Survey
              </NavLink>
              
              <NavLink 
                to="/results" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-teal-700 text-white' 
                      : 'text-teal-100 hover:bg-teal-500 hover:text-white'
                  }`
                }
              >
                <BarChart2 className="h-4 w-4 inline mr-1" />
                Results
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;