import React from 'react';

interface Article {
  title: string;
  meta: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  styles: any;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, styles }) => {
  return (
    <div className={styles.relatedArticles}>
      <h3 className={styles.relatedTitle}>
        Связанные материалы
      </h3>
      <div className={styles.relatedGrid}>
        {articles.map((article, index) => (
          <div key={index} className={styles.relatedItem}>
            <div className={styles.relatedItemTitle}>
              {article.title}
            </div>
            <div className={styles.relatedItemMeta}>
              {article.meta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;