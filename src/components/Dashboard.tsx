import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Products from './Products';
import Salary from './Salary';
import TeamMembers from './TeamMembers';
import RealTimeClock from './RealTimeClock';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={setActiveTab} />;
      case 'products':
        return <Products />;
      case 'salary':
        return <Salary />;
      case 'team':
        return <TeamMembers />;
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'overview' && 'Welcome to your Shippy admin dashboard'}
                {activeTab === 'products' && 'Manage your product inventory'}
                {activeTab === 'salary' && 'Track and manage salary information'}
                {activeTab === 'team' && 'Manage team members and roles'}
              </p>
            </div>
            <RealTimeClock />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;