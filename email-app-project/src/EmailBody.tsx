import { useEffect, useState } from 'react';
import { useAppContext } from './AppContextProvider';

const EmailBody = () => {
  const { data, activeEmailId, toggleFavoriteAndRerenderUpdatedList } =
    useAppContext();

  const singleEmailUrl = `https://flipkart-email-mock.now.sh/?id=${activeEmailId}`;
  const [bodyLoading, setBodyLoading] = useState(true);
  const [emailBody, setEmailBody] = useState('');
  const [error, setError] = useState(false);

  const fetchSingleEmail = async (url: string) => {
    try {
      setBodyLoading(true);
      const res = await fetch(url);

      if (!res.ok || !res) {
        throw new Error('Cant fetch');
      }
      const { body } = await res.json();
      setEmailBody(body);
      setBodyLoading(false);
      setError(false);
      // return singleEmailBody;
    } catch (err) {
      setBodyLoading(false);
      setError(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSingleEmail(singleEmailUrl);
  }, [singleEmailUrl]);

  const emailClicked = data?.find(
    (singleEmail) => singleEmail.id === activeEmailId
  );

  let emailBodyHTML: JSX.Element | undefined;

  if (error) {
    emailBodyHTML = <p className='error-msg'>Unable to fetch email body.</p>;
  } else if (bodyLoading) {
    emailBodyHTML = <p>Loading Email Body...</p>;
  } else {
    emailBodyHTML = (
      <div
        className='emailBody'
        dangerouslySetInnerHTML={{ __html: emailBody }}
      ></div>
    );
  }

  // console.log({ error, bodyLoading, emailBody });

  return (
    <section className='email-body'>
      <div className='avatar'>
        <span>{emailClicked?.from.name[0].toUpperCase()}</span>
      </div>
      <main>
        <header>
          <h2>{emailClicked?.subject}</h2>
          {emailClicked?.isFavorite ? (
            <button
              className='fav-btn'
              onClick={() =>
                toggleFavoriteAndRerenderUpdatedList(activeEmailId)
              }
            >
              UnMark as favorite
            </button>
          ) : (
            <button
              className='fav-btn'
              onClick={() =>
                toggleFavoriteAndRerenderUpdatedList(activeEmailId)
              }
            >
              Mark as favorite
            </button>
          )}
        </header>
        <p className='email-body-date'>{emailClicked?.date}</p>
        {emailBodyHTML}
      </main>
    </section>
  );
};

export default EmailBody;
