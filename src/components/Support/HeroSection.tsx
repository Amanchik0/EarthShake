import React from 'react';

interface HeroSectionProps {
  styles: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ styles }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>Мы здесь, чтобы помочь</h1>
      </div>
    </section>
  );
};

export default HeroSection;