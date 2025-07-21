import  { useState } from 'react';
import './AuthPage.css';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(formData.password.length < 5){
      setError("Passwords must be at least 5 characters long.");
      return
    }
    if (!formData.role) {
      setError('Please select a role.');
      return;
    }
    setError('');
    axiosInstance.post( '/user/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        { withCredentials: true } 
      )
      .then((res) => {
        setUser(res.data.user);
        if (formData.role === "professor") {
          navigate('/teacher-dashboard');
      } else {
          navigate('/student-dashboard');
      }
    })
    .catch((err) => {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong while registration");
    });
   
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" id="role" onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
