import React from 'react';
import { Comment } from '../../types/types';

interface CommentsSectionProps {
  comments: Comment[];
  styles: any;
}

const CommentSection: React.FC<CommentsSectionProps> = ({ comments, styles }) => {
  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Комментарии ({comments.length})</h2>
      
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.authorAvatar}>
            <img src={comment.avatarUrl} alt="Автор комментария" />
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.commentMeta}>
              <div><strong>{comment.author}</strong></div>
              <div>{comment.date}</div>
            </div>
            <div className={styles.commentText}>{comment.text}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CommentSection;