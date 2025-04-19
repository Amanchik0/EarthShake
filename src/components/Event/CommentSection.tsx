import React from 'react';
import { Comment } from '../../types/types';

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  return (
    <section className="comments-section">
      <h2 className="section-title">Комментарии ({comments.length})</h2>
      
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="author-avatar">
            <img src={comment.avatarUrl} alt="Автор комментария" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="comment-meta">
              <div><strong>{comment.author}</strong></div>
              <div>{comment.date}</div>
            </div>
            <div className="comment-text">{comment.text}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CommentSection;