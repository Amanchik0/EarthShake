import React, { useState } from 'react';

const safetyRecommendations = [
  {
    id: 1,
    title: 'Stay calm',
    content: 'Keep calm and avoid panic during emergencies.',
    content2: 'Deep breaths and a clear mind help you act wisely.',
  },
  {
    id: 2,
    title: 'Prepare essentials',
    content: 'Have a bag ready with water, documents, etc.',
    content2: 'Add power banks, medicine, and some food as well.',
  },
  {
    id: 3,
    title: 'Follow updates',
    content: 'Listen to official announcements and news.',
    content2: 'Stay connected through radio or mobile apps.',
  },
  {
    id: 4,
    title: 'Help others',
    content: 'Support neighbors and people in need.',
    content2: 'Together, communities become more resilient.',
  },
];

const GuidelinesPage = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const toggleFlip = (id: number) => {
    setFlippedCard(prev => (prev === id ? null : id));
  };

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
        {safetyRecommendations.map((rec) => {
          const isFlipped = flippedCard === rec.id;

          return (
            <div
              key={rec.id}
              onClick={() => toggleFlip(rec.id)}
              style={{
                perspective: '1000px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#f0cfd1',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease, scale 0.3s ease',
                  }}
                  className="card-face"
                >
                  <h4 style={{ marginBottom: '0.5rem' }}>{rec.title}</h4>
                  <p>{rec.content}</p>
                </div>

                {/* Back */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#f0cfd1',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <h4 style={{ marginBottom: '0.5rem' }}>{rec.title}</h4>
                  <p>{rec.content2}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidelinesPage;
