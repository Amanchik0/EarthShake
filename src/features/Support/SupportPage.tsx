import React from 'react';
import HeroSection from '../../components/Support/HeroSection';
import SupportGrid from '../../components/Support/SupportGrid';
// import FAQSection from '../../components/Support/FAQSection';
import styles from './SupportPage.module.css';

const SupportPage: React.FC = () => {
  return (
    <div className={styles.supportPage}>
      <HeroSection styles={styles} />
      <main className={styles.container}>
        <SupportGrid styles={styles} />
        {/* <FAQSection styles={styles} /> */}
      </main>
    </div>
  );
};

export default SupportPage;