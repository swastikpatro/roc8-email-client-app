import { useAppContext } from './AppContextProvider';

const FilterBtn = () => {
  // @ts-ignore
  const { activeFilter, filterAndDisplay } = useAppContext();
  const filterList = ['all', 'unread', 'read', 'favorites'];

  const handleFilterContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetEleInBtnContainer = e.target as HTMLElement;
    if (!('btn' in targetEleInBtnContainer.dataset)) {
      return;
    }

    const filterBtnClickedName = targetEleInBtnContainer.dataset.btn!;
    filterAndDisplay(filterBtnClickedName);
    // console.log(activeEmailId);
  };
  return (
    <header>
      <span>Filter by:</span>
      <div
        className='filter-btn-container'
        onClick={handleFilterContainerClick}
      >
        {filterList.map((singleFilter, index) => (
          <button
            data-btn={singleFilter}
            className={
              singleFilter === activeFilter
                ? 'filter-btn activeBtn'
                : 'filter-btn'
            }
            key={index}
          >
            {singleFilter}
          </button>
        ))}
      </div>
    </header>
  );
};

export default FilterBtn;
