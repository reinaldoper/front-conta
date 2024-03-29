import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../service/fetch';
import { Alert } from '@mui/material';
import NavbarUser from '../components/NavbarUser';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ClearAccount() {
  AOS.init({
    duration: 2500,
  });

  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const resul = localStorage.getItem('token');
      const { token } = JSON.parse(resul);
      const emails = localStorage.getItem('email');
      const update = {
        email: JSON.parse(emails),
      };
      const options = {
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      const result = await fetchUser(options, '/get');
      setUser(result);
    };
    getData();
  }, []);

  const handleClick = async () => {
    if (validateEmail(email)) {
      const resul = localStorage.getItem('token');
      const { token } = JSON.parse(resul);
      const update = {
        email,
      };

      const options = {
        method: 'DELETE',
        body: JSON.stringify(update),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      const { message } = await fetchUser(options, '/');
      if (message) {
        setShowAlert(true);
        setMsg(message);
        setEmail('');
        startTimer();
      } else {
        setEmail('');
        navigate('/');
      }
    } else {
      setShowAlert(true);
      setMsg('Please check the email format.');
      setEmail('');
      startTimer();
    }
  };

  const startTimer = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const validateEmail = (email) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
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
              <h3 style={{ color: 'black', }}>Account Delete</h3>
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
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    data-testId='button-delete'
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10vw',
                      height: '5vh',
                      marginTop: '0.5vw',
                      textAlign: 'center'
                    }}
                    className="btn btn-danger"
                    onClick={handleClick}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </form>
            </div>
            {showAlert && (
              <Alert severity="error">
                This is an error alert — <strong>{msg}</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
