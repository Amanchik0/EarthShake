import React from 'react';

const events = [
  {
    id: 1,
    title: 'Event',
    description: 'Description of event',
    date: '05/05/05',
  },
  {
    id: 2,
    title: 'Event',
    description: 'Description of event',
    date: '05/05/05',
  },
  {
    id: 3,
    title: 'Event',
    description: 'Description of event',
    date: '05/05/05',
  },
  {
    id: 4,
    title: 'Event',
    description: 'Description of event',
    date: '05/05/05',
  },
];

const NewsPage  = () => {
  return (
    <div style={{ backgroundColor: '#fff9f9', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 600 }}>LATEST EVENTS</h2>

      {/* Search and filter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          margin: '1rem 0 2rem',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            border: '1px solid #ccc',
            width: '250px',
          }}
        />
        <button
          style={{
            border: 'none',
            background: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ⚙️
        </button>
      </div>

      {/* Event list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0cfd1',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'black', borderRadius: '8px' }} />
              <div>
                <h4 style={{ margin: 0 }}>{event.title.toUpperCase()}</h4>
                <p style={{ margin: 0 }}>{event.description}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>{event.date}</p>
              <a href="#" style={{ fontSize: '0.9rem', color: 'blue' }}>view more</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
