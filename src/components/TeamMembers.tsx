import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Mail, Phone, User, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
}

const TeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Employee',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const roles = ['Admin', 'Manager', 'Employee', 'Intern', 'Contractor'];

  useEffect(() => {
    const savedMembers = localStorage.getItem('shippy_team_members');
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    } else {
      // Initialize with sample data
      const initialMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@shippy.com',
          phone: '+91 9876543210',
          role: 'Admin',
          joinDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@shippy.com',
          phone: '+91 9876543211',
          role: 'Manager',
          joinDate: '2024-02-20'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@shippy.com',
          phone: '+91 9876543212',
          role: 'Employee',
          joinDate: '2024-03-10'
        }
      ];
      setTeamMembers(initialMembers);
      localStorage.setItem('shippy_team_members', JSON.stringify(initialMembers));
    }
  }, []);

  const saveTeamMembers = (updatedMembers: TeamMember[]) => {
    setTeamMembers(updatedMembers);
    localStorage.setItem('shippy_team_members', JSON.stringify(updatedMembers));
  };

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.email.trim()) {
      const member: TeamMember = {
        id: Date.now().toString(),
        ...newMember
      };
      const updatedMembers = [...teamMembers, member];
      saveTeamMembers(updatedMembers);
      setNewMember({ name: '', email: '', phone: '', role: 'Employee', joinDate: new Date().toISOString().split('T')[0] });
      setShowAddForm(false);
    }
  };

  const handleEditMember = (id: string, field: keyof TeamMember, value: any) => {
    const updatedMembers = teamMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    );
    saveTeamMembers(updatedMembers);
  };

  const handleDeleteMember = (id: string) => {
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    saveTeamMembers(updatedMembers);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Employee':
        return 'bg-green-100 text-green-800';
      case 'Intern':
        return 'bg-yellow-100 text-yellow-800';
      case 'Contractor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h2>
          <p className="text-gray-600">Manage team member accounts and contact details.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
              <input
                type="date"
                value={newMember.joinDate}
                onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleAddMember}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Save className="h-4 w-4" />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      {editingId === member.id ? (
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleEditMember(member.id, 'name', e.target.value)}
                          className="text-sm font-medium text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === member.id ? (
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleEditMember(member.id, 'email', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{member.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === member.id ? (
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleEditMember(member.id, 'phone', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{member.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === member.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleEditMember(member.id, 'role', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === member.id ? (
                      <input
                        type="date"
                        value={member.joinDate}
                        onChange={(e) => handleEditMember(member.id, 'joinDate', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {new Date(member.joinDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {editingId === member.id ? (
                        <>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(member.id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Members</p>
            <p className="text-2xl font-bold">{teamMembers.length}</p>
            <p className="text-blue-100 text-sm mt-1">Active Team</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-green-100 text-sm mb-1">Admins</p>
            <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'Admin').length}</p>
            <p className="text-green-100 text-sm mt-1">Admin Users</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-1">Employees</p>
            <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'Employee').length}</p>
            <p className="text-purple-100 text-sm mt-1">Staff Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;