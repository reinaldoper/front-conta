import { useState, useEffect } from 'react';
import { fetchTransaction, fetchUser } from '../service/fetch';
import { Alert } from '@mui/material';
import AddIcon from "@mui/icons-material/Add"
import NavbarUser from '../components/NavbarUser';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CreateCashback = () => {
  AOS.init({
    duration: 2500,
  });

  const [msg, setMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [cashback, setCashback] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const getData = async () => {
      const result = await fetchUserData();
      setUser(result);
    };
    getData();
  }, []);

  const fetchUserData = async () => {
    const token = JSON.parse(localStorage.getItem('token')).token;
    const email = JSON.parse(localStorage.getItem('email'));
    const update = {
      email: email,
    };
    const options = {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    };
    return await fetchUser(options, '/get');
  };

  const handleClick = async () => {
    const { token } = JSON.parse(localStorage.getItem('token'));
    const update = {
      transactionId,
      cashback,
    };
    const options = {
      method: 'PUT',
      body: JSON.stringify(update),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    };
    const { message, data } = await fetchTransaction(options, '/');
    if (message) {
      setShowAlert(true);
      setMsg(message);
      resetForm();
      startTimer(showAlert, setShowAlert);
    } else {
      setAlert(true);
      setMsg(data);
      resetForm();
      startTimer(alert, setAlert);
    }
  };

  const resetForm = () => {
    setTransactionId('');
    setCashback('');
  };

  const startTimer = (flag, setFlag) => {
    setTimeout(() => {
      setFlag(false);
    }, 3000);
  };

  return (
    <>
      <h5 className="card-header"><NavbarUser data={user.data} /></h5>
      <div className="container" data-aos="fade-down">
        <div className="d-flex justify-content-center h-100">
          <div className="card" style={{
            height: '37vh',
            marginTop: '20rem',
            marginBottom: 'auto',
            backgroundColor: '#a5e6c8',
            width: '30vw'
          }}>
            <div className="card-header">
              <h3 style={{ color: 'black', }}>Cashback create</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                  </div>
                  <input
                    type="text"
                    style={{ marginBottom: '0.2vw' }}
                    className="form-control"
                    value={transactionId}
                    placeholder="transactionId"
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input
                    type="text"
                    style={{ marginBottom: '0.2vw' }}
                    className="form-control"
                    value={cashback}
                    placeholder="cashback"
                    onChange={(e) => setCashback(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    data-testId='button'
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10vw',
                      height: '5vh',
                      marginTop: '0.5vw',
                      textAlign: 'center'
                    }}
                    className="btn btn-success"
                    onClick={handleClick}
                  >
                    <AddIcon />
                  </button>
                </div>
              </form>
            </div>
            {showAlert && (
              <Alert severity="error">
                This is an error alert — <strong>{msg}</strong>
              </Alert>
            )}
            {alert && (
              <Alert severity="success">
                Success — <strong>{msg}</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCashback;
