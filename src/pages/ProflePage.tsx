import React, { useState } from 'react';
 const userProfile = {
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  country: 'Kazakhstan',
  region: 'Almaty',
  address: 'Al-Farabi 77',
  extraLeft: '',
  extraRight: '',
};

const ProfilePage = () => {
  const [formData, setFormData] = useState(userProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Saved:', formData);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#fff9f9', padding: '2rem' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: 'black', borderRadius: '50%' }} />
          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>{formData.username}</p>
            <a href="#" style={{ fontSize: '12px', color: 'gray' }}>edit profile</a>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li>Personal data</li>
          <li>Add publication</li>
          <li>Subscriptions</li>
          <li>My publications</li>
          <li>Support/FAQ</li>
        </ul>
      </div>

      {/* RIGHT MAIN FORM */}
      <div style={{ flex: 1, backgroundColor: '#f1d5d6', marginLeft: '2rem', padding: '2rem', borderRadius: '8px' }}>
        {/* Avatar + Username */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: 'black', borderRadius: '50%' }} />
          <p style={{ marginLeft: '1rem', fontWeight: 'bold' }}>{formData.username}</p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Name" style={inputStyle} />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" style={inputStyle} />
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country, Region" style={inputStyle} />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={inputStyle} />
          <input name="extraLeft" value={formData.extraLeft || ''} onChange={handleChange} placeholder="Extra Left" style={inputStyle} />
          <input name="extraRight" value={formData.extraRight || ''} onChange={handleChange} placeholder="Extra Right" style={inputStyle} />
        </div>

        <button onClick={handleSubmit} style={buttonStyle}>Save changes</button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '0.7rem 1rem',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#e9c7c7',
};

const buttonStyle: React.CSSProperties = {
  marginTop: '2rem',
  padding: '0.7rem 1.4rem',
  border: 'none',
  backgroundColor: '#d4a0a0',
  borderRadius: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default ProfilePage;
