import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import { credentials } from './mocks/register.mock';

import Login from '../src/page/Login';
import { vi, describe } from 'vitest'
import { server } from './mocks/server.mock';


beforeAll(() => server.listen({ onUnhandledRequest: 'bypass'}));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());





describe('Login', () => {
  it('Texting click in the route Create User', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const texto = screen.getByText(/Sign In/i);

    expect(texto).toBeInTheDocument();

    const link = screen.getByText(/create user/i);
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
  });
  it('Texting click in the message alert', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    const msg = screen.getByText(/This is an error alert/i);
    expect(msg).toBeInTheDocument();
    await waitFor(() => {
      expect(msg).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('Texting elements inputs email and message error.', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const email = screen.getByRole('textbox');
    expect(email).toBeInTheDocument();
    const password = screen.getByPlaceholderText(/password/i);
    expect(password).toBeInTheDocument();
    fireEvent.change(email, { target: { value: 'reinaldoper' } });
    fireEvent.change(password, { target: { value: '123456' } });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    const msg = screen.getByText(/This is an error alert/i);
    expect(msg).toBeInTheDocument();
    await waitFor(() => {
      expect(msg).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('Texting elements inputs email and password corrects.', async () => {

    vi
      .fn()
      .mockImplementationOnce(credentials.validEmail)
      .mockImplementationOnce(credentials.validPassword)

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const email = screen.getByRole('textbox');
    expect(email).toBeInTheDocument();
    const password = screen.getByPlaceholderText(/password/i);
    expect(password).toBeInTheDocument();
    fireEvent.change(email, { target: { value: credentials.validEmail } });
    fireEvent.change(password, { target: { value: credentials.validPassword } });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });

  it('Texting elements inputs email and User not found.', async () => {

    render(
      <BrowserRouter>
        <Login url="/users" />
      </BrowserRouter>
    );

    const email = screen.getByRole('textbox');
    expect(email).toBeInTheDocument();
    const password = screen.getByPlaceholderText(/password/i);
    expect(password).toBeInTheDocument();
    fireEvent.change(email, { target: { value: 'joao@gmail.com' } });
    fireEvent.change(password, { target: { value: credentials.validPassword } });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    
    await waitFor(() => {
      const msg = screen.queryByText(/This is an error alert —/i);
      expect(msg).toBeInTheDocument()
    });


    await waitFor(() => {
      const msg = screen.queryByText(/This is an error alert —/i);
      expect(msg).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });
});