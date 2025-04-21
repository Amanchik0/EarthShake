import React from 'react';

interface Article {
  title: string;
  meta: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  return (
    <div className="related-articles">
      <h3 className="related-title">Связанные материалы</h3>
      
      <div className="related-grid">
        {articles.map((article, index) => (
          <div key={index} className="related-item">
            <div className="related-item-title">{article.title}</div>
            <div className="related-item-meta">{article.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;