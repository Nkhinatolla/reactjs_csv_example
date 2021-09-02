import { Header } from './Header';
import {Button, Spinner, Table, Toast, ToastContainer} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import './schemas.css';
import {useEffect, useState, useCallback} from "react";

export const Schemas = () => {
  const token = localStorage.token;

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [show, setShow] = useState(false);

  const fetchSchemes = useCallback(() => {
    fetch("https://csv-example.herokuapp.com/api/fakecsv/schema/", {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setSchemas(result);
          setLoading(false);
        }
      ).catch(() => {
      setLoading(false);
      setError('Error');
    })
  }, [token]);

  useEffect(() => {
    fetchSchemes();
  }, [token, fetchSchemes]);

  const onDelete = (id) => () => {
    fetch(`https://csv-example.herokuapp.com/api/fakecsv/schema/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(
        () => {
          setShow(true);
          setLoading(false);
          fetchSchemes();
        }
      )
    };

  if (!token) {
    return <Redirect to="/login" />
  }

  return <div>
    <Header/>
    <div className="cont">
      <div className="d-flex align-items-center justify-content-between my-4">
        <h3>Data schemas</h3>
        <Link to="/schemas/new">
         <Button variant="success">New schema</Button>
        </Link>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {isLoading && (
          <tr>
            <td colSpan={4}>
              <div className="d-flex justify-content-center">
                <Spinner animation="border" className="my-3" variant="primary" />
              </div>
            </td>
          </tr>
        )}

        {error && (
          <tr>
            <td colSpan={4}>
              <div className="d-flex justify-content-center">
                <p className="text-danger">{error}</p>
              </div>
            </td>
          </tr>
        )}

        {schemas.map((n) => (
            <tr>
              <td>{n.id}</td>
              <td>
                <Link to={`/schemas/${n.id}/dataset`} className="scheme-title">{n.title}</Link>
              </td>
              <td>{n.modified}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Link to={`/schemas/${n.id}/edit`} className="edit">Edit scheme</Link>
                  <Button variant="link" className="p-0 delete" onClick={onDelete(n.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    <ToastContainer position="bottom-center">
      <Toast onClose={() => setShow(false)} bg="info" show={show} delay={5000}  autohide>
        <Toast.Body>
          <p>Successfully Updated</p>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  </div>
};
