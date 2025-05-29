import React from 'react';

interface CommentSectionProps {
  comments: Record<string, any>;
  styles: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, styles }) => {
  // Преобразуем объект комментариев в массив
  const commentsArray = Object.entries(comments).map(([id, comment]) => ({
    id,
    author: comment.author || 'Аноним',
    text: comment.text || comment.content || '',
    date: comment.date || comment.createdAt || 'Недавно',
    avatarUrl: comment.avatarUrl
  }));

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Комментарии ({commentsArray.length})</h2>
      
      {commentsArray.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--dark-gray)' }}>
          <p>Пока нет комментариев. Будьте первым!</p>
        </div>
      ) : (
        commentsArray.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.authorAvatar}>
              {comment.avatarUrl ? (
                <img src={comment.avatarUrl} alt="Автор комментария" />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%', 
                  height: '100%',
                  background: 'var(--light-gray)',
                  fontWeight: 'bold'
                }}>
                  {comment.author.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.commentMeta}>
                <div><strong>{comment.author}</strong></div>
                <div>{comment.date}</div>
              </div>
              <div className={styles.commentText}>{comment.text}</div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default CommentSection;