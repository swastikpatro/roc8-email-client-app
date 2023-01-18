import { useAppContext } from './AppContextProvider';
import './index.css';
import FilterBtn from './FilterBtn';
import EmailList from './EmailList';
import EmailBody from './EmailBody';

export default function App() {
  const {
    emailListLoading,
    emailListError,
    activeEmailId,
    removeEmailBodyFromScreen,
  } = useAppContext();

  return (
    <>
      <div className='center-page'>
        <div
          className={
            activeEmailId !== null ? 'overlay overlay-active' : 'overlay'
          }
        >
          <span className='cancel-btn' onClick={removeEmailBodyFromScreen}>
            X
          </span>
        </div>

        <main>
          <FilterBtn />
          {/* display-email-body */}
          <section
            className={
              activeEmailId !== null
                ? 'email-list-container display-email-body'
                : 'email-list-container'
            }
          >
            {emailListError ? (
              <p className='error-msg'>Unable to fetch your list of emails</p>
            ) : emailListLoading ? (
              <p>Loading your data...</p>
            ) : (
              <>
                <EmailList />
                <EmailBody />
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
