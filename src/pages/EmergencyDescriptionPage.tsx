// src/pages/EmergencyDescriptionPage.tsx
import React from 'react';

const emergencyData = {
  title: 'EMERGENCY',
  date: '05/05/05',
  image: '', // Можно позже подставить URL изображения
  description: 'DESCRIPTION EVENT',
  region: 'REGION',
  reminder: 'brief reminder in case of emergency',
};

const EmergencyDescriptionPage = () => {
  return (
    <div className="emergency-page" style={{ padding: '2rem', fontFamily: 'serif' }}>
      <h2 style={{ fontWeight: 600 }}>{emergencyData.title}</h2>
      <p style={{ color: '#999', marginTop: '-0.5rem' }}>{emergencyData.date}</p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* Заглушка под изображение */}
        <div
          style={{
            width: '200px',
            height: '150px',
            backgroundColor: 'black',
            backgroundImage: emergencyData.image ? `url(${emergencyData.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>{emergencyData.description}</h4>
          <p style={{ color: '#999' }}>{emergencyData.region}</p>
        </div>
      </div>

      <p style={{ marginTop: '3rem', fontWeight: 500 }}>
        {emergencyData.reminder}
      </p>
    </div>
  );
};

export default EmergencyDescriptionPage;
