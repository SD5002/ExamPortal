import { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  

  const { user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    axiosInstance.post('/user/login', {
      email: formData.email,
      password: formData.password
      }, { withCredentials: true })

      .then((res) => {
        const user = res.data.user;
        setUser(user);

        if (user.role === "professor") {
          navigate('/teacher-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Something went wrong while login");
      });

     
    
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={handleChange} required />
          </div>

          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
