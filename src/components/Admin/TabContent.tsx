// import { useState } from 'react';
// import { TabType } from '../../types/adminTypes';
// import SearchBar from './SearchBar';
// import FilterDropdown from './FilterDropdown';
// import DataTable from './DataTable';

// const TabContent = ({ activeTab }: { activeTab: TabType }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const getSearchPlaceholder = () => {
//     switch (activeTab) {
//       case 'users': return 'пользователей';
//       case 'events': return 'событий';
//       case 'communities': return 'сообществ';
//       default: return '';
//     }
//   };

//   return (
//     <div id={activeTab} className={`tab-content ${activeTab === 'users' ? 'active' : ''}`}>
//       <div className="search-filter-container">
//         <SearchBar
//           placeholder={`Поиск ${getSearchPlaceholder()}...`}
//           onSearch={setSearchQuery}
//         />
//         <FilterDropdown tab={activeTab} />
//       </div>
      
//       <DataTable tab={activeTab} searchQuery={searchQuery} />
      
//       <Pagination 
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default TabContent;