import React from 'react';

interface EventComment {
  readonly id: string;
  readonly author: string;
  readonly text: string;
  readonly date: string;
  readonly avatarUrl: string;
}

interface CommentSectionProps {
  comments: EventComment[]; // Теперь массив, а не объект
  styles: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, styles }) => {
  // Обрабатываем массив комментариев
  const commentsArray = Array.isArray(comments) ? comments : [];

  // Форматируем дату для отображения
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Комментарии ({commentsArray.length})</h2>
      
      {commentsArray.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--dark-gray)' }}>
          <p>Пока нет комментариев. Будьте первым!</p>
        </div>
      ) : (
        <div className={styles.commentsList}>
          {commentsArray.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.authorAvatar}>
                {comment.avatarUrl ? (
                  <img 
                    src={comment.avatarUrl} 
                    alt="Автор комментария"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div style={{ 
                  display: comment.avatarUrl ? 'none' : 'flex',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '40px', 
                  height: '40px',
                  background: 'var(--light-gray)',
                  fontWeight: 'bold',
                  color: 'var(--dark-gray)',
                  borderRadius: '50%',
                  fontSize: '1.1rem'
                }}>
                  {comment.author?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentAuthor}>
                    <strong>{comment.author || 'Аноним'}</strong>
                  </div>
                  <div className={styles.commentDate}>
                    {formatDate(comment.date)}
                  </div>
                </div>
                <div className={styles.commentText}>
                  {comment.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;