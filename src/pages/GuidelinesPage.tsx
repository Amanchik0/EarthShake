import React from 'react';

const safetyRecommendations = [
  { id: 1, title: 'Stay calm', content: 'Keep calm and avoid panic during emergencies.' },
  { id: 2, title: 'Prepare essentials', content: 'Have a bag ready with water, documents, etc.' },
  { id: 3, title: 'Follow updates', content: 'Listen to official announcements and news.' },
  { id: 4, title: 'Help others', content: 'Support neighbors and people in need.' },
];

const GuidelinesPage = () => {
  return (
    <div style={{ backgroundColor: '#fff9f9', paddingBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', padding: '2rem 0', fontWeight: 600 }}>
        SAFETY RECOMMENDATIONS
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {safetyRecommendations.map((rec) => (
          <div
            key={rec.id}
            style={{
              backgroundColor: '#f0cfd1',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              minHeight: '120px',
            }}
          >
            <h4 style={{ marginBottom: '0.5rem' }}>{rec.title}</h4>
            <p>{rec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidelinesPage;
