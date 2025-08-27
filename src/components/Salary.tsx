import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Calendar, DollarSign, CreditCard, Smartphone, Building2, AlertCircle } from 'lucide-react';

interface SalaryData {
  currentSalary: number;
  nextSalaryDate: string;
  nextSalaryAmount: number;
  totalEarnings: number;
  lastUpdate: string;
}

interface WithdrawalData {
  amount: number;
  method: 'bank' | 'upi' | 'card';
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  upiId?: string;
  cardNumber?: string;
}

const Salary: React.FC = () => {
  const [salaryData, setSalaryData] = useState<SalaryData>({
    currentSalary: 45000,
    nextSalaryDate: '2025-08-25',
    nextSalaryAmount: 3500,
    totalEarnings: 170000,
    lastUpdate: new Date().toISOString().split('T')[0]
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Partial<SalaryData>>({});
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawalStep, setWithdrawalStep] = useState(1);
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({
    amount: 0,
    method: 'bank'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const ifscCodes = [
    'SBIN0000001', 'HDFC0000001', 'ICIC0000001', 'AXIS0000001', 'PUNB0000001',
    'CNRB0000001', 'UBIN0000001', 'IOBA0000001', 'BKID0000001', 'CBIN0000001',
    'ALLA0000001', 'VIJB0000001', 'INDB0000001', 'MAHB0000001', 'TMBL0000001'
  ];

  useEffect(() => {
    const savedSalaryData = localStorage.getItem('shippy_salary');
    if (savedSalaryData) {
      setSalaryData(JSON.parse(savedSalaryData));
    } else {
      localStorage.setItem('shippy_salary', JSON.stringify(salaryData));
    }

    // Auto-update next salary date if current date has passed
    const today = new Date();
    const nextSalary = new Date(salaryData.nextSalaryDate);
    if (today > nextSalary) {
      const newDate = new Date(today);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(25);
      const updatedData = {
        ...salaryData,
        nextSalaryDate: newDate.toISOString().split('T')[0]
      };
      setSalaryData(updatedData);
      localStorage.setItem('shippy_salary', JSON.stringify(updatedData));
    }
  }, []);

  const saveSalaryData = (updatedData: SalaryData) => {
    setSalaryData(updatedData);
    localStorage.setItem('shippy_salary', JSON.stringify(updatedData));
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValues({ [field]: salaryData[field as keyof SalaryData] });
  };

  const handleSave = (field: string) => {
    if (tempValues[field as keyof SalaryData] !== undefined) {
      const updatedData = {
        ...salaryData,
        [field]: tempValues[field as keyof SalaryData],
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      saveSalaryData(updatedData);
    }
    setEditingField(null);
    setTempValues({});
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleWithdrawalSubmit = async () => {
    if (withdrawalStep === 1) {
      if (withdrawalData.amount > 0 && withdrawalData.amount <= salaryData.totalEarnings) {
        setWithdrawalStep(2);
      }
    } else if (withdrawalStep === 2) {
      setIsLoading(true);
      // Simulate loading for 10 seconds
      setTimeout(() => {
        setIsLoading(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setShowWithdrawal(false);
          setWithdrawalStep(1);
          setWithdrawalData({ amount: 0, method: 'bank' });
        }, 5000);
      }, 10000);
    }
  };

  const getDaysUntilNextSalary = () => {
    const today = new Date();
    const nextSalary = new Date(salaryData.nextSalaryDate);
    const diffTime = nextSalary.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilSalary = getDaysUntilNextSalary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary Management</h2>
          <p className="text-gray-600">Manage salary information and track earnings from Shippy.</p>
        </div>
        <button
          onClick={() => setShowWithdrawal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <DollarSign className="h-5 w-5" />
          <span>Withdraw Salary</span>
        </button>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Withdrawal...</h3>
                <p className="text-gray-600">Please wait while we process your request.</p>
              </div>
            ) : showError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Withdrawal Failed</h3>
                <p className="text-red-600 mb-4">Unable to connect to server. Please contact the server owner to withdraw money.</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">Contact Support:</p>
                  <p className="text-sm font-medium text-red-900">support@shippy.com</p>
                  <p className="text-sm font-medium text-red-900">+91 9876543210</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {withdrawalStep === 1 ? 'Withdraw Salary' : 'Payment Details'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowWithdrawal(false);
                      setWithdrawalStep(1);
                      setWithdrawalData({ amount: 0, method: 'bank' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {withdrawalStep === 1 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-2">Available Balance</p>
                      <p className="text-2xl font-bold text-blue-900">₹{salaryData.totalEarnings.toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Withdrawal Amount
                      </label>
                      <input
                        type="number"
                        value={withdrawalData.amount || ''}
                        onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amount to withdraw"
                        max={salaryData.totalEarnings}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Salary Source
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Current Salary</p>
                            <p className="text-sm text-gray-500">Monthly salary amount</p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{salaryData.currentSalary.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Next Salary</p>
                            <p className="text-sm text-gray-500">Upcoming payment</p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{salaryData.nextSalaryAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                          <div>
                            <p className="font-medium text-blue-900">Total Earnings</p>
                            <p className="text-sm text-blue-600">Available for withdrawal</p>
                          </div>
                          <p className="font-semibold text-blue-900">₹{salaryData.totalEarnings.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleWithdrawalSubmit}
                      disabled={!withdrawalData.amount || withdrawalData.amount > salaryData.totalEarnings}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Continue to Payment Details
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700 mb-1">Withdrawal Amount</p>
                      <p className="text-xl font-bold text-green-900">₹{withdrawalData.amount.toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Withdrawal Method
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                          onClick={() => setWithdrawalData({ ...withdrawalData, method: 'bank' })}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors duration-200 ${
                            withdrawalData.method === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Building2 className="h-6 w-6" />
                          <span className="text-sm font-medium">Bank Transfer</span>
                        </button>
                        <button
                          onClick={() => setWithdrawalData({ ...withdrawalData, method: 'upi' })}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors duration-200 ${
                            withdrawalData.method === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Smartphone className="h-6 w-6" />
                          <span className="text-sm font-medium">UPI</span>
                        </button>
                        <button
                          onClick={() => setWithdrawalData({ ...withdrawalData, method: 'card' })}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors duration-200 ${
                            withdrawalData.method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <CreditCard className="h-6 w-6" />
                          <span className="text-sm font-medium">Card</span>
                        </button>
                      </div>
                    </div>

                    {withdrawalData.method === 'bank' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number
                          </label>
                          <input
                            type="text"
                            value={withdrawalData.accountNumber || ''}
                            onChange={(e) => setWithdrawalData({ ...withdrawalData, accountNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter account number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC Code
                          </label>
                          <select
                            value={withdrawalData.ifscCode || ''}
                            onChange={(e) => setWithdrawalData({ ...withdrawalData, ifscCode: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select IFSC Code</option>
                            {ifscCodes.map(code => (
                              <option key={code} value={code}>{code}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            value={withdrawalData.accountHolderName || ''}
                            onChange={(e) => setWithdrawalData({ ...withdrawalData, accountHolderName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter account holder name"
                          />
                        </div>
                      </div>
                    )}

                    {withdrawalData.method === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={withdrawalData.upiId || ''}
                          onChange={(e) => setWithdrawalData({ ...withdrawalData, upiId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter UPI ID (e.g., user@paytm)"
                        />
                      </div>
                    )}

                    {withdrawalData.method === 'card' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={withdrawalData.cardNumber || ''}
                          onChange={(e) => setWithdrawalData({ ...withdrawalData, cardNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter card number"
                          maxLength={16}
                        />
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setWithdrawalStep(1)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleWithdrawalSubmit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        Submit Withdrawal
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            {editingField === 'totalEarnings' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('totalEarnings')}
                  className="text-white hover:text-green-200 transition-colors duration-200"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-green-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit('totalEarnings')}
                className="text-white hover:text-green-200 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <p className="text-green-100 text-sm mb-1">Total Earnings</p>
            {editingField === 'totalEarnings' ? (
              <input
                type="number"
                value={tempValues.totalEarnings || ''}
                onChange={(e) => setTempValues({ ...tempValues, totalEarnings: parseFloat(e.target.value) || 0 })}
                className="bg-transparent text-2xl font-bold text-white border-b border-green-200 focus:outline-none focus:border-white w-full"
                autoFocus
              />
            ) : (
              <p className="text-2xl font-bold">₹{salaryData.totalEarnings.toLocaleString()}</p>
            )}
            <p className="text-green-100 text-sm mt-1">From Shippy</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            {editingField === 'currentSalary' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('currentSalary')}
                  className="text-white hover:text-blue-200 transition-colors duration-200"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-blue-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit('currentSalary')}
                className="text-white hover:text-blue-200 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Salary</p>
            {editingField === 'currentSalary' ? (
              <input
                type="number"
                value={tempValues.currentSalary || ''}
                onChange={(e) => setTempValues({ ...tempValues, currentSalary: parseFloat(e.target.value) || 0 })}
                className="bg-transparent text-2xl font-bold text-white border-b border-blue-200 focus:outline-none focus:border-white w-full"
                autoFocus
              />
            ) : (
              <p className="text-2xl font-bold">₹{salaryData.currentSalary.toLocaleString()}</p>
            )}
            <p className="text-blue-100 text-sm mt-1">Monthly</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            {editingField === 'nextSalaryDate' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('nextSalaryDate')}
                  className="text-white hover:text-purple-200 transition-colors duration-200"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-purple-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit('nextSalaryDate')}
                className="text-white hover:text-purple-200 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-1">Next Salary</p>
            {editingField === 'nextSalaryDate' ? (
              <input
                type="date"
                value={tempValues.nextSalaryDate || ''}
                onChange={(e) => setTempValues({ ...tempValues, nextSalaryDate: e.target.value })}
                className="bg-transparent text-xl font-bold text-white border-b border-purple-200 focus:outline-none focus:border-white w-full mb-2"
                autoFocus
              />
            ) : (
              <p className="text-xl font-bold">
                {new Date(salaryData.nextSalaryDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
            <p className="text-lg font-semibold text-purple-100 mt-1">₹{salaryData.nextSalaryAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            {editingField === 'nextSalaryAmount' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('nextSalaryAmount')}
                  className="text-white hover:text-indigo-200 transition-colors duration-200"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-indigo-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit('nextSalaryAmount')}
                className="text-white hover:text-indigo-200 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <p className="text-indigo-100 text-sm mb-1">Next Salary Amount</p>
            {editingField === 'nextSalaryAmount' ? (
              <input
                type="number"
                value={tempValues.nextSalaryAmount || ''}
                onChange={(e) => setTempValues({ ...tempValues, nextSalaryAmount: parseFloat(e.target.value) || 0 })}
                className="bg-transparent text-2xl font-bold text-white border-b border-indigo-200 focus:outline-none focus:border-white w-full"
                autoFocus
              />
            ) : (
              <p className="text-2xl font-bold">₹{salaryData.nextSalaryAmount.toLocaleString()}</p>
            )}
            <p className="text-indigo-100 text-sm mt-1">Editable Amount</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <p className="text-orange-100 text-sm mb-1">Days Until Salary</p>
            <p className="text-2xl font-bold">
              {daysUntilSalary > 0 ? daysUntilSalary : 'Due Today!'}
            </p>
            <p className="text-orange-100 text-sm mt-1">
              {daysUntilSalary > 0 ? 'Days remaining' : 'Payment due'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <p className="text-teal-100 text-sm mb-1">Salary Progress</p>
            <p className="text-2xl font-bold">
              {Math.round(((30 - Math.max(daysUntilSalary, 0)) / 30) * 100)}%
            </p>
            <p className="text-teal-100 text-sm mt-1">Monthly Progress</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Salary History</h3>
          <div className="space-y-4">
            {[
              { month: 'July 2025', amount: 3500, status: 'Paid', date: '2025-07-25' },
              { month: 'June 2025', amount: 3500, status: 'Paid', date: '2025-06-25' },
              { month: 'May 2025', amount: 3500, status: 'Paid', date: '2025-05-25' },
              { month: 'April 2025', amount: 3500, status: 'Paid', date: '2025-04-25' },
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{record.month}</p>
                  <p className="text-sm text-gray-500">Paid on {record.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{record.amount.toLocaleString()}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Current Salary Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Base Salary:</span>
                  <span className="text-sm font-medium text-blue-900">₹{salaryData.currentSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Next Salary:</span>
                  <span className="text-sm font-medium text-blue-900">₹{salaryData.nextSalaryAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Next Date:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {new Date(salaryData.nextSalaryDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Currency:</span>
                  <span className="text-sm font-medium text-blue-900">INR (₹)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Payment Cycle:</span>
                  <span className="text-sm font-medium text-blue-900">Monthly</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Earnings Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Total from Shippy:</span>
                  <span className="text-sm font-medium text-green-900">₹{salaryData.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Average Monthly:</span>
                  <span className="text-sm font-medium text-green-900">₹{Math.round(salaryData.totalEarnings / 5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Last Updated:</span>
                  <span className="text-sm font-medium text-green-900">
                    {new Date(salaryData.lastUpdate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;