import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavbarUser = ({ data }) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container style={{ backgroundColor: '#c4c776', borderRadius: '5px'}}>
        <Navbar.Brand as={Link} to="/">Login - Page</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/clean">delete</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/create">Transaction-Create</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/transaction">
                Transaction
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/recover">RecoverAccount</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cashback">Cashback - Create</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          { data ? <span style={{marginRight: '1.5vw'}}>cpf: { data.cpf }</span>: null}
          { data ? <span style={{marginLeft: '1.5vw'}}>name: { data.name } </span>: null }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

NavbarUser.propTypes = {
  data: PropTypes.object.isRequired,
};

export default NavbarUser;
