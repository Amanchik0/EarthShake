import React from 'react';
 const news = [
    {
      id: 1,
      title: 'Event',
      description: 'Full description of the event in detail...',
      date: '05/05/05',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Event',
      description: 'Short description of another event',
      date: '05/05/05',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Event',
      description: 'Another similar event description',
      date: '05/05/05',
      image: 'https://via.placeholder.com/150',
    },
  ];
  
const NewsDescriptionPage = () => {
  const currentNews = news[0]; // заглушка: первая новость
  const similarNews = news.slice(1); // похожие новости

  return (
    <div style={{ backgroundColor: '#fff9f9', padding: '2rem' }}>
      <h2>{currentNews.title}</h2>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <img
          src={currentNews.image}
          alt="event"
          style={{ width: '200px', height: '200px', backgroundColor: 'black' }}
        />
        <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>{currentNews.description}</p>
      </div>

      <h3>SIMILAR EVENTS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {similarNews.map((event) => (
          <div
            key={event.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0cfd1',
              borderRadius: '12px',
              padding: '0.8rem 1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'black', borderRadius: '8px' }} />
              <div>
                <h4 style={{ margin: 0 }}>{event.title}</h4>
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

export default NewsDescriptionPage;
