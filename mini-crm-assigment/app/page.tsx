"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import type { DefaultSession } from 'next-auth';
import { CustomerT } from '@assets/types/types';
import ConfirmationModal from '@components/ConfirmationModal';
import '@styles/css/index.css';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
    };
  }
}

interface InputValues {
  total_spends: [number | null, number | null];
  visits: [number | null, number | null];
  last_visit: [Date | null, Date | null];
}

const MyPage: React.FC = () => {
  const [inputValues, setInputValues] = useState<InputValues>({
    total_spends: [null, null],
    visits: [null, null],
    last_visit: [null, null]
  });
  const [audienceCount, setAudienceCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showPastCamps, setShowPastCamps] = useState(false);
  const [pastMessages, setPastMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // const [customers, setCustomers] = useState<CustomerT[]>([]);

  const { data: session } = useSession();

  const handleInputChange = (field: keyof InputValues, index: number, value: string) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [field]: prevValues[field].map((el, i) =>
        i === index ? (field === 'last_visit' ? new Date(value) : parseFloat(value)) : el
      ) as [number | null, number | null] | [Date | null, Date | null]
    }));
  };

  const handleCheck = async () => {
    setLoading(true);
    const constraints = {
      total_spends: inputValues.total_spends,
      visits: inputValues.visits,
      last_visit: inputValues.last_visit,
    };
    const fetchPastMessages = async () => {
      try {
        const response = await fetch('/api/communication-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            constraints
          }),
        });
        const res = await response.json();
        setPastMessages(res);
      } catch (error) {
        console.error('Error fetching past messages:', error);
      }
    }
    fetchPastMessages();
    setShowPastCamps(true);
    setLoading(false);
  };

  const handleSend = async () => {
    const data = {
      total_spends: inputValues.total_spends,
      visits: inputValues.visits,
      last_visit: inputValues.last_visit
    };

    try {
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      const res = await response.json();
      console.log(res);
      setAudienceCount(res);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Get details of the customers

  // useEffect(() => {
  //   const getCustomers = async () => {
  //     try {
  //       const response = await fetch('/api/customer', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(inputValues)
  //       });
  //       const allCustomers = await response.json();
  //       let minTS = Number.MAX_VALUE;
  //       let maxTS = Number.MIN_VALUE;
  //       let minVisits = Number.MAX_VALUE;
  //       let maxVisits = Number.MIN_VALUE;
  //       allCustomers.forEach((c: CustomerT) => {
  //         minTS = Math.min(minTS, c.total_spends);
  //         maxTS = Math.max(maxTS, c.total_spends);
  //         minVisits = Math.min(minVisits, c.visits);
  //         maxVisits = Math.max(maxVisits, c.visits);
  //       })
  //       console.log("Final", minTS, maxTS, minVisits, maxVisits);

  //       setCustomers(allCustomers);

  //       if (!response.ok) {
  //         throw new Error('Failed to post customer');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   getCustomers();
  // }, []);

  // Generate random customers and upload to db

  // useEffect(() => {
  //   const customers: CustomerT[] = generateRandomCustomers(50);

  //   const postCustomer = async (customer: CustomerT) => {
  //     try {
  //       const response = await fetch('/api/customer/new', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(customer)
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to post customer');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   customers.forEach(customer => {
  //     postCustomer(customer);
  //   });
  // }, []);


  return (
    <div className="Page">
      <div className='Page__heading'>
        {'Enter Constraints to filter customers'} 
        <span>{' (leave empty if not needed)'}</span>
      </div>
      <div className='Page__constraints'>
        <div className='Page__form'>
          Total spends
          <div className='Page__form-inputs'>
            <input
              type="number"
              className='Page__form-input'
              placeholder='Total spends lower bound'
              value={inputValues.total_spends[0] ?? ''}
              onChange={e => handleInputChange('total_spends', 0, e.target.value)}
            />
            <input
              type="number"
              className='Page__form-input'
              placeholder='Total spends upper bound'
              value={inputValues.total_spends[1] ?? ''}
              onChange={e => handleInputChange('total_spends', 1, e.target.value)}
            />
          </div>
        </div>
        <div className='Page__form'>
          Visits
          <div className='Page__form-inputs'>
            <input
              type="number"
              className='Page__form-input'
              placeholder='Visits lower bound'
              value={inputValues.visits[0] ?? ''}
              onChange={e => handleInputChange('visits', 0, e.target.value)}
            />
            <input
              type="number"
              className='Page__form-input'
              placeholder='Visits upper bound'
              value={inputValues.visits[1] ?? ''}
              onChange={e => handleInputChange('visits', 1, e.target.value)}
            />
          </div>
        </div>
        <div className='Page__form'>
          Last Visit
          <div className='Page__form-inputs'>
            <input
              type="date"
              className='Page__form-input'
              placeholder='Last visit lower bound'
              value={inputValues.last_visit[0] ? inputValues.last_visit[0].toISOString().substr(0, 10) : ''}
              onChange={e => handleInputChange('last_visit', 0, e.target.value)}
            />
            <input
              type="date"
              className='Page__form-input'
              placeholder='Last visit upper bound'
              value={inputValues.last_visit[1] ? inputValues.last_visit[1].toISOString().substr(0, 10) : ''}
              onChange={e => handleInputChange('last_visit', 1, e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleCheck}
        className='Page__form-btn'
      >
        Check
      </button>
      {showPastCamps ? (
        <div className='Page__past'>
          <div className='Page__past-heading'>
            Past Campaigns
          </div>
          {loading?(
            'Loading...'
          ) : (
            <div className='Page__past-container'>
              {pastMessages.length > 0 ? 
              (pastMessages.map((msg, id) => (
                <div className='Page__past-msg' key={id}>
                  {`Hi {name}, ${msg} on your next order`}
                </div>
              ))) : (
                'No past Campaigns'
              )}
            </div>
          )}
          <button className='Page__past-btn' onClick={handleSend}>Send</button>
        </div>
      ) : (
        ''
      )}
      {showModal ? (
        <ConfirmationModal totalSpends={inputValues.total_spends} visits={inputValues.visits} lastVisit={inputValues.last_visit} audienceCount={audienceCount} setShowModal={setShowModal} pastMessages={pastMessages} setPastMessages={setPastMessages} />
      ) : (
        ''
      )}
    </div>
  );
};

export default MyPage;