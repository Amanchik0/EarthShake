import React from 'react';

interface CommentSectionProps {
  comments: Record<string, any>;
  styles:any
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, styles }) => {
  const commentsArray = Object.entries(comments).map(([id, comment]) => ({
    id,
    author: comment.author || 'Аноним',
    text: comment.text || comment.content || '',
    date: comment.date || comment.createdAt || 'Недавно',
    avatarUrl: comment.avatarUrl
  }));

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>💬 Комментарии ({commentsArray.length})</h2>
      
      {commentsArray.length === 0 ? (
        <div className={styles.noComments}>
          <p>Пока нет комментариев. Будьте первым!</p>
        </div>
      ) : (
        <div className={styles.commentsList}>
          {commentsArray.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {comment.avatarUrl ? (
                  <img src={comment.avatarUrl} alt="Автор комментария" />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentMeta}>
                  <strong>{comment.author}</strong>
                  <span className={styles.commentDate}>{comment.date}</span>
                </div>
                <div className={styles.commentText}>{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;