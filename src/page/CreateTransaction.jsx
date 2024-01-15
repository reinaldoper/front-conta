import { useState, useEffect } from 'react';
import { fetchTransaction, fetchUser } from '../service/fetch';
import { Alert } from '@mui/material';
import AddIcon from "@mui/icons-material/Add"
import NavbarUser from '../components/NavbarUser';
import formateCPF from '../utils/FormataCpf';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CreateTransaction = () => {
  AOS.init({
    duration: 2500,
  });

  const [msg, setMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [value, setValue] = useState('');
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
      accountId: formateCPF(accountId),
      value: Number(value),
    };
    const options = {
      method: 'POST',
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
      setMsg(data.transactionId);
      resetForm();
      startTimerTrue();
    }
  };

  const resetForm = () => {
    setAccountId('');
    setValue('');
  };

  const startTimer = (flag, setFlag) => {
    setTimeout(() => {
      setFlag(false);
    }, 3000);
  };

  const startTimerTrue = () => {
    setTimeout(() => {
      setAlert(false);
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
              <h3 style={{ color: 'black', }}>Transaction create</h3>
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
                    value={accountId}
                    placeholder="accountId"
                    onChange={(e) => setAccountId(e.target.value)}
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
                    value={value}
                    placeholder="value"
                    onChange={(e) => setValue(e.target.value)}
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
                TransactionId — <strong>{msg}</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTransaction;
