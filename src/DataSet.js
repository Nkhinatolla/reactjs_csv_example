import { Header } from './Header';
import {Button, Spinner, Table, Badge, Form} from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import './schemas.css';
import {useEffect, useState, useCallback} from "react";

export const DataSet = () => {
  const { id } = useParams();
  const token = localStorage.token;

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataset, setDataset] = useState([]);
  const [number, setNumber] = useState(1);

  const fetchSchemes = useCallback(() => {
    fetch(`https://csv-example.herokuapp.com/api/fakecsv/schema/${id}/dataset/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setDataset(result);
          setLoading(false);
        }
      ).catch(() => {
      setLoading(false);
      setError('Error');
    })
  }, [token, id]);

  useEffect(() => {
    fetchSchemes();
  }, [token, fetchSchemes]);

  const onNumberChange = (e) => setNumber(e.target.value);

  const onGenerate = () => {
    fetch(`https://csv-example.herokuapp.com/api/fakecsv/schema/${id}/dataset/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        rows: number,
        schema_id: id,
      }),
    })
      .then(res => res.json())
      .then(
        () => {
          fetchSchemes();
          setLoading(false);
        }
      ).catch(() => {
      setLoading(false);
      setError('Error');
    })
  };

  if (!token) {
    return <Redirect to="/login" />
  }

  return <div>
    <Header/>
    <div className="cont">
      <div className="d-flex align-items-center justify-content-between my-4">
        <h3>Data sets</h3>
        <div className="d-flex align-items-center">
          <p>Rows</p>
          <Form.Control style={{ width: 100, marginLeft: 12, marginRight: 12 }} type="number" value={number} onChange={onNumberChange} />
         <Button variant="success" onClick={onGenerate}>Generate data</Button>
        </div>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Created</th>
            <th>Status</th>
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

        {dataset.map((n) => (
            <tr>
              <td>{n.id}</td>
              <td>{n.created}</td>
              <td>
                <Badge bg={n.status === 'PROCESSING' ? 'secondary' : 'success'}>{n.status}</Badge>
              </td>
              <td>
                {n.status === 'READY' && (
                  <a href={n.url || ''} style={{ color: '#0275D8' }} target="_blank">Download</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
};
