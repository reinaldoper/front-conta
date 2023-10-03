import NavbarUser from "../components/NavbarUser";
import { useEffect, useState } from "react";
import { fetchUser } from "../service/fetch";
import formatDate from "../utils/formateData";
import formatCpf from "../utils/RetornCpf";
import { CunstomList, StyledPagination } from "../styles/loginForm";



export default function Transaction() {
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 6;
  const totalItemsCount = transaction.length;

  useEffect(() => {
    const getData = async () => {
      const resul = localStorage.getItem('token');
      const { token } = JSON.parse(resul);
      console.log(resul, token);
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
      const response = {
        method: 'PATCH',
        body: JSON.stringify({ cpf: result.data.cpf }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
      const { message, data } = await fetchUser(response, '/transaction');
      if (message) {
        setMsg(message);
      } else {
        setTransaction(data.sort((a, b) => extractDate(b.date) - extractDate(a.date)));
      }

    }
    getData();
  }, []);

  const extractDate = (timestamp) => {
    const [datePart] = timestamp.split(' ');
    return new Date(datePart);
  }

  let totalCashbackEmReais = 0;
  if (transaction.length > 0) {
    totalCashbackEmReais += transaction.reduce((total, item) => {
      const cashbackValor = Number(item.value) * Number(item.cashback);
      return total + cashbackValor;
    }, 0);
  }

  const result = (transaction.length > 0 ? transaction.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage).map((transacao) => (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1rem',
      marginBottom: '1rem',
      border: 'none',
      width: '40vw',
    }} key={transacao.id}>
      <div className="card-body" style={{ backgroundColor: '#a5e6c8', borderRadius: '8px'}}>
        <h5 className="card-title">Cashback: {transacao.cashback}</h5>
        <h6 className="card-subtitle mb-2 text-muted">TransactionId: {transacao.transactionId}</h6>
        <h5 className="card-title">accountId: {formatCpf(transacao.accountId)}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Date: {formatDate(transacao.date)}</h6>
        <p className="card-text">Value: {transacao.value}</p>
      </div>
    </div>
  )) : <h1 style={{ color: '#0f7d7e', margin: 'auto' }}>Not one<br></br> transactions!</h1>);

  const handlePageChange = (page) => {
    setActivePage(Number(page));
  };

  return (
    <>
      <NavbarUser data={user.data} />
      {msg.length > 0 ? <h1 style={{ textAlign: 'center', color: '#0f7d7e', marginTop: '20vh' }}>{msg}</h1> :
        <CunstomList>
          <h3 style={{ color: '#232226', backgroundColor: '#abbb9f', borderRadius: '8px', marginTop: '10px' }}>cashback: {totalCashbackEmReais.toFixed(2)}R$</h3>
          <ul style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '10vh',
            flexWrap: 'wrap',
            justifyContent: 'center',
            
          }}>
            {result}
          </ul>
          {result.length > 0 ?
            <StyledPagination
              count={Math.ceil(totalItemsCount / itemsPerPage)}
              page={activePage}
              onChange={(event, page) => handlePageChange(page)}
            /> : null}
        </CunstomList>
      }
    </>
  )
}
