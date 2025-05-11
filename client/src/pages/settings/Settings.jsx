import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Save, User } from 'lucide-react';
// You'll need to create this context if you want to use it
// import AuthContext from '../../context/AuthContext';

const Settings = () => {
  // Uncomment this when you have created the AuthContext
  // const { user, updateUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const { name, email, currentPassword, newPassword, confirmPassword } = formData;
  
  // Uncomment this when you have created the AuthContext
  // useEffect(() => {
  //   if (user) {
  //     setFormData(prevState => ({
  //       ...prevState,
  //       name: user.name || '',
  //       email: user.email || ''
  //     }));
  //   }
  // }, [user]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Add your form validation logic here
    
    // This is a placeholder for the actual update functionality
    try {
      setLoading(true);
      
      // Placeholder for API call
      // await updateUser(formData);
      
      toast.success('Settings updated successfully');
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={name}
                    onChange={onChange}
                  />
                </div> */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={email}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-input"
                    value={currentPassword}
                    onChange={onChange}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      value={newPassword}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={confirmPassword}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} className="mr-1" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
