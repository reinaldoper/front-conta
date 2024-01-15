import NavbarUser from "../components/NavbarUser";
import { useEffect, useState } from "react";
import { fetchUser } from "../service/fetch";
import formatDate from "../utils/formateData";
import formatCpf from "../utils/RetornCpf";
import { CunstomList, StyledPagination } from "../styles/loginForm";
import cashback from "../assets/images/cashback.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Transaction = () => {
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 6;
  const totalItemsCount = transaction.length;

  AOS.init({
    duration: 2000,
  });

  useEffect(() => {
    const getData = async () => {
      const resultToken = localStorage.getItem('token');
      const { token } = JSON.parse(resultToken);

      const resultEmail = localStorage.getItem('email');
      const update = {
        email: JSON.parse(resultEmail),
      };

      const options = {
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };

      try {
        const result = await fetchUser(options, '/get');
        setUser(result);

        const response = {
          method: 'PATCH',
          body: JSON.stringify({ cpf: result.data.cpf }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        };

        const { message, data } = await fetchUser(response, '/transaction');

        if (message) {
          setMsg(message);
        } else {
          setTransaction(data.sort((a, b) => extractDate(b.date) - extractDate(a.date)));
        }
      } catch (error) {
        setMsg('An error occurred while processing your request.');
      }
    };

    getData();
  }, []);

  const extractDate = (timestamp) => {
    const [datePart] = timestamp.split(' ');
    return new Date(datePart);
  };

  let totalCashbackEmReais = 0;

  if (transaction.length > 0) {
    totalCashbackEmReais += transaction.reduce((total, item) => {
      const cashbackValor = Number(item.value) * Number(item.cashback);
      return total + cashbackValor;
    }, 0);
  }

  const renderTransaction = (transacao) => (
    <div className="card" data-aos="flip-left" 
      style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1rem',
      marginBottom: '1rem',
      border: 'none',
      width: '40vw',
    }} key={transacao.id}>
      <div className="card-body" style={{ backgroundColor: '#a5e6c8', borderRadius: '8px' }}>
        <h5 className="card-title">Cashback: {transacao.cashback}</h5>
        <h6 className="card-subtitle mb-2 text-muted">TransactionId: {transacao.transactionId}</h6>
        <h5 className="card-title">accountId: {formatCpf(transacao.accountId)}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Date: {formatDate(transacao.date)}</h6>
        <p className="card-text">Value: {transacao.value}</p>
      </div>
    </div>
  );

  const handlePageChange = (page) => {
    setActivePage(Number(page));
  };

  return (
    <>
      <div className="card bg-secondary">
        <h5 className="card-header"><NavbarUser data={user.data} /></h5>
        <div className="div-content">
          <div className="card-body" data-aos="fade-down">
            <h5 className="card-title">Transactions</h5>
            <p className="card-text">All content your transactions.</p>
            <h5>cashback: {totalCashbackEmReais.toFixed(2)}R$</h5>
          </div>
          <img src={cashback} data-aos="fade-down" alt="cashback" className="img"/>
        </div>
      </div>

      {msg.length > 0 ? (
        <h1 style={{ textAlign: 'center', color: '#0f7d7e', marginTop: '20vh' }}>{msg}</h1>
      ) : (
        <CunstomList>
          <ul style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '5vh',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {transaction.length > 0
              ? transaction.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage).map(renderTransaction)
              : <h1 style={{ color: '#0f7d7e', margin: 'auto' }}>Not one<br></br> transactions!</h1>
            }
          </ul>
          {transaction.length > 0
            ? (
              <StyledPagination
                count={Math.ceil(totalItemsCount / itemsPerPage)}
                page={activePage}
                onChange={(event, page) => handlePageChange(page)}
              />
            ) : null
          }
        </CunstomList>
      )}
    </>
  );
};

export default Transaction;
