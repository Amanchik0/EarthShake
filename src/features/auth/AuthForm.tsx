import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    // Здесь будет запрос к серверу
    alert(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully!`);

    navigate('/');
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center' }}>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #aaa' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #aaa' }}
          />
        </div>
        {mode === 'register' && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #aaa' }}
            />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#f0cfd1',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
          }}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
