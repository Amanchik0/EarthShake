import React from 'react';
import styles from '../../features/Main/mainStyle.module.css';
import { Community } from '../../types/community';


interface CommunitySectionProps {
    communities: Community[];
    onCommunityClick: (communityId: number) => void;
    maxVisibleCards?: number; // Optional prop to limit the number of visible cards
    
}
const CommunitySection: React.FC<CommunitySectionProps> = ({ communities, onCommunityClick, maxVisibleCards = 4 }) => {
            const displayedEvents = communities.slice(0, maxVisibleCards);

    return (
    <section className={styles.section}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Популярные сообщества</h2>
                <p className={styles.sectionSubtitle}>Найдите единомышленников и присоединяйтесь к активным сообществам</p>
            </div>
            <div className={styles.communityCards}>
                  {displayedEvents.map((community) => (
                <div key={community.id} className={styles.communityCard}>
                    <img src={community.imageUrl} alt={community.name} className={styles.communityIcon}/>
                    <h3 className={styles.communityTitle}>{community.name}</h3>
                    <p className={styles.communityMembers}>{community.numberMembers} участников </p>
                    <button  onClick={()=> onCommunityClick(community.id)} className={styles.communityButton}>Подробнее</button>
                </div>
                    ))}
            </div>
            <a href="/communities" className={styles.viewAll}>Смотреть все сообщества</a>
        </div>
    </section>
    );
};
export default CommunitySection;