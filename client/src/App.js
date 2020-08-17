import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './App.scss';

function App() {
  const [variables, setVariables ] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const submitRegisterForm = e => {
    e.preventDefault();
    console.log(variables);
  }

  return (
    <Container className="pt-5">
      <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <div>
            <Form onSubmit={submitRegisterForm}>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={variables.email} onChange={
                  (e) => setVariables({...variables, email: e.target.value})
                }/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={variables.username} onChange={
                  (e) => setVariables({...variables, username: e.target.value})
                }/>
              </Form.Group>{' '}
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" value={variables.password} onChange={
                  (e) => setVariables({...variables, password: e.target.value})
                }/>
              </Form.Group>{' '}
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="text" value={variables.confirmPassword} onChange={
                  (e) => setVariables({...variables, confirmPassword: e.target.value})
                }/>
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
