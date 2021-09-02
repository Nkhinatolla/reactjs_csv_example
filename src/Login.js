import { Form, Button, Spinner } from 'react-bootstrap';
import './login.css';
import { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";

export const Login = () => {
  const history = useHistory();
  const isLogged = !!localStorage.getItem('token');


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUsernameChange = (e) => setUsername(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const onLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("https://csv-example.herokuapp.com/api-token-auth/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(res => {
        if (res.token) {
          setError('');
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', username);
          history.push('/schemas');
        } else {
          setError('Error');
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError('Error');
      });
  };

  if (isLogged) {
    return <Redirect to="/" />;
  }

  return <div className="login">
    <Form className="login-form" onSubmit={onLogin}>
      <h1 className="login-header">Login</h1>
      <Form.Group className="mt-5 mb-3">
        <Form.Control value={username} type="text" placeholder="Username" onChange={onUsernameChange} className="login-form__username" />
      </Form.Group>

      <Form.Group>
        <Form.Control value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
      </Form.Group>

      {error && <p className="text-danger mt-3">{error}</p>}
      <Button variant="primary" type="submit" className="login-form__submit mt-3">
        {isLoading && <Spinner animation="border" style={{ marginRight: '8px' }} variant="light" size="sm" />}
        Login
      </Button>
    </Form>
  </div>
};
