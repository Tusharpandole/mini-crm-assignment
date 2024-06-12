import { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import '@styles/css/Modal.css';
import 'react-toastify/dist/ReactToastify.css';

interface ConfirmationModalProps {
  totalSpends: [number | null, number | null];
  visits: [number | null, number | null];
  lastVisit: [Date | null, Date | null];
  audienceCount: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  pastMessages: string[];
  setPastMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ totalSpends, visits, lastVisit, audienceCount, setShowModal, pastMessages, setPastMessages }) => {
  const [message, setMessage] = useState('');

  const handleSendClick = async () => {
    const constraints = {
      total_spends: totalSpends,
      visits,
      last_visit: lastVisit,
    };
    if(message.length > 0) {
    try {
      const response = await fetch('/api/communication-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          constraints,
          message,
          audience_count: audienceCount,
        }),
      });
      const res = await response.json();
      console.log(res);
      toast.success("Message sent successfully");
      setShowModal(false);
      setPastMessages([...pastMessages, message]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    }
    else {
      toast.error('Please enter a messsage');
    }
  };

  const handleCancelClick = () => {
    setShowModal(false);
  }

  return (
    <div className="Modal">
      <div className="Modal__overlay">
      <div className="Modal__content">
        <h2 className="Modal__heading">
          Confirmation
        </h2>
        <div className="Modal__info">
          <p className="Modal__info-const">
            Total Spends: 
            <span className="Modal__info-data"> from {totalSpends[0] ?? 'N/A'} to {totalSpends[1] ?? 'N/A'}</span>
          </p>
          <p className="Modal__info-const">
            Visits: 
            <span className="Modal__info-data"> from {visits[0] ?? 'N/A'} to {visits[1] ?? 'N/A'}</span>
          </p>
          <p className="Modal__info-const">
            Last Visited: 
            <span className="Modal__info-data"> from {lastVisit[0] ? lastVisit[0].toISOString().substr(0, 10) : 'N/A'} to {lastVisit[1] ? lastVisit[1].toISOString().substr(0, 10) : 'N/A'}</span>
          </p>
          <p className="Modal__info-count">
            Send message to 
            <span className="Modal__info-num"> {audienceCount} </span> 
            people
          </p>
        </div>
        <div className="Modal__message">
          <div>
            {"Hi {name}, "}
          </div>
          <input
            type="text"
            className="Modal__message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here"
          />
          <div>
            {" on the next order"}
          </div>
        </div>
        <div className="Modal__buttons">
          <button className="Modal__buttons-btn" onClick={handleSendClick}>
            Send
          </button>
          <button className="Modal__buttons-btn" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
