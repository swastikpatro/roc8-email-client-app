import { useRef } from 'react';
import { useAppContext } from './AppContextProvider';
import { ITEMS_PERPAGE } from './AppContextProvider';

// [
//   {},
//   {},
//   {},
//   {},
//   {},
//   {}
// ]

// [
//   [{}, {}, {}]
//   [{}, {}, {}]
// ]

// @ts-ignore
const getPaginatedData = (data, itemsPerPage: number) => {
  if (data.length < 1) {
    return [[]];
  }

  const lengthOfPagingatedData = Math.ceil(data.length / itemsPerPage);
  const paginatedData = Array.from(
    { length: lengthOfPagingatedData },
    (_, i) => {
      return [...data.slice(i * itemsPerPage, (i + 1) * itemsPerPage)];
    }
  );
  return paginatedData;
};

const EmailList = () => {
  const {
    displayableList: emailList,
    activeEmailId,
    showBodyMakeItReadAndActive,
    removeEmailBodyFromScreen,
    activeFilter,
    paginatedIndex,
    setPaginateButtonActive,
  } = useAppContext();
  const previousActiveEmailRef = useRef<HTMLElement | null>(null);

  const paginatedEmailListArr = getPaginatedData(emailList, ITEMS_PERPAGE);
  const listToShow = paginatedEmailListArr[paginatedIndex];

  const emailListLengthRef = useRef<number | null>(null);

  const handleEmailListContainerClick = (e: React.MouseEvent<HTMLElement>) => {
    const targetEleInEmailContainer = e.target as HTMLElement;
    // console.log(targetEleInEmailContainer);

    const closestArticleToTargetEle = targetEleInEmailContainer.closest(
      '.single-email'
    ) as HTMLElement;

    if (
      !closestArticleToTargetEle ||
      !closestArticleToTargetEle.classList.contains('single-email')
    ) {
      return;
    }

    const idOfEmailClicked = closestArticleToTargetEle.dataset.emailId!;

    showBodyMakeItReadAndActive(idOfEmailClicked);

    previousActiveEmailRef.current = closestArticleToTargetEle;

    emailListLengthRef.current = emailList?.length;

    previousActiveEmailRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });

    if (activeEmailId === previousActiveEmailRef.current.dataset.emailId) {
      removeEmailBodyFromScreen();
    }
  };

  const handlePaginatedBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetEleInPaginatedBtnContainer = e.target as HTMLElement;
    // console.log(targetEleInEmailContainer);

    if (!('paginatedBtn' in targetEleInPaginatedBtnContainer.dataset)) {
      return;
    }

    const btnIndex = targetEleInPaginatedBtnContainer.dataset.paginatedBtn;

    setPaginateButtonActive(Number(btnIndex));

    (
      document.querySelector('.email-list-section')
        ?.firstElementChild as HTMLElement
    ).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  if (listToShow.length < 1) {
    return (
      <section
        className='email-list-section'
        onClick={handleEmailListContainerClick}
      >
        <p className='no-list-message'>No {activeFilter} messages</p>
      </section>
    );
  }

  return (
    <section
      className='email-list-section'
      onClick={handleEmailListContainerClick}
    >
      <div className='email-list-container'>
        {listToShow.map((singleEmail) => {
          const {
            id,
            date,
            subject,
            short_description,
            from,
            isRead,
            isFavorite,
          } = singleEmail;

          let emailClassName;
          if (isRead && id === activeEmailId) {
            emailClassName = 'single-email read active-email';
          } else if (isRead) {
            emailClassName = 'single-email read';
          } else {
            emailClassName = 'single-email';
          }
          return (
            <article key={id} className={emailClassName} data-email-id={id}>
              <div className='avatar'>
                <span>{from.name[0].toUpperCase()}</span>
              </div>
              <div className='email-info'>
                <p className='email-head'>
                  From: <span className='email-name'>{from.name}</span>
                  <span>{`<${from.email}>`}</span>
                </p>
                <p>
                  Subject: <span className='dark-font'>{subject}</span>
                </p>
                <p className='email-info-desc'>{short_description}</p>

                <div className='email-info-date'>
                  <p>{date}</p>
                  {isFavorite && (
                    <span className='favorite-span'>Favorite</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {paginatedEmailListArr.length > 1 && (
        <div
          className='paginate-btn-container'
          onClick={handlePaginatedBtnClick}
        >
          {paginatedEmailListArr.map((_, i) => (
            <button
              className={
                Number(paginatedIndex) === i
                  ? 'paginate-btn paginate-btn-active'
                  : 'paginate-btn'
              }
              data-paginated-btn={i}
              key={i}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmailList;
