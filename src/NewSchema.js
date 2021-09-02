import { Fragment } from 'react';
import { Header } from './Header';
import {Button, Form, Spinner, Toast, ToastContainer} from 'react-bootstrap';
import './schemas.css';
import {useState} from "react";
import {useHistory} from "react-router-dom";

export const NewSchema = () => {
  const token = localStorage.token;
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const [scheme, setScheme] = useState({
    title: '',
    column_separator: ',',
    string_character: '"',
    columns: [],
  });
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'FULL_NAME',
    order: 0,
    extra_data: {
      start_range: 0,
      end_range: 0,
    },
    action: 'ADD',
  });

  const onTitleChange = (e) => setScheme((prev) => ({ ...prev, title: e.target.value }));

  const onChange = (e) => {
    setScheme((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  };

  const onColumnChange = (id) => (e) => {
    const columnIndex = scheme.columns.findIndex((n) => n.id === id);
    const updatedColumn = scheme.columns[columnIndex];
    if (columnIndex !== -1) {
      setScheme((prev) => {
        return ({ ...prev, columns: [
            ...prev.columns.slice(0,columnIndex),
            { ...updatedColumn, [e.target.name]: e.target.value },
            ...prev.columns.slice(columnIndex + 1),
          ] })
      })
    }
  };

  const onExtraDataChange = (id) => (e) => {
    const columnIndex = scheme.columns.findIndex((n) => n.id === id);
    const updatedColumn = scheme.columns[columnIndex];
    if (columnIndex !== -1) {
      setScheme((prev) => {
        return ({ ...prev, columns: [
            ...prev.columns.slice(0,columnIndex),
            { ...updatedColumn,
              extra_data: {
                ...updatedColumn.extra_data,
                [e.target.name]: e.target.value
              }
            },
            ...prev.columns.slice(columnIndex + 1),
          ] })
      })
    }
  };

  const onNewColumnChange = (e) => {
    setNewColumn((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onNewColumnExtraDataChange = (e) => {
    setNewColumn((prev) => ({ ...prev, extra_data: {
      ...prev.extra_data,
      [e.target.name]: e.target.value
      }
    }));
  };

  const onAddColumn = () => {
    if (newColumn.name && newColumn.order > -1) {
      setScheme((prev) => ({...prev, columns: [...prev.columns, newColumn] }));
      setNewColumn({
        name: '',
        type: 'FULL_NAME',
        order: 0,
        extra_data: {
          start_range: 0,
          end_range: 0,
        },
        action: 'ADD',
      })
    }
  };

  const onRemoveColumn = (id) => () => {
    const columnIndex = scheme.columns.findIndex((n) => n.id === id);
    const updatedColumn = scheme.columns[columnIndex];
    if (columnIndex !== -1) {
      setScheme((prev) => {
        return ({ ...prev, columns: [
            ...prev.columns.slice(0,columnIndex),
            { ...updatedColumn, action: 'DELETE' },
            ...prev.columns.slice(columnIndex + 1),
          ] })
      })
    }
  };

  const onSubmit = () => {
    fetch(`https://csv-example.herokuapp.com/api/fakecsv/schema/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(scheme),
    })
      .then(res => res.json())
      .then(
        (result) => {
          history.push(`/schemas/${result.id}/edit`)
          setLoading(false);
          setShow(true);
        }
      ).catch(() => {
      setLoading(false);
      setError('Error');
    })
  };

  return <div>
    <Header/>

    {isLoading && <div className="d-flex w-100 justify-content-center">
      <Spinner animation="border" className="my-5" variant="primary" />
    </div>}

    {error && <p className="text-danger">{error}</p>}

    {scheme && (
      <div className="cont">
        <div className="d-flex align-items-center justify-content-between my-4">
          <h3>New schema</h3>
          <Button variant="primary" onClick={onSubmit}>Submit</Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={scheme.title} onChange={onTitleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Column separator</Form.Label>
          <Form.Select value={scheme.column_separator} name="column_separator" onChange={onChange}>
            <option value=",">Comma (,)</option>
            <option value=".">Dot (.)</option>
            <option value="~">Tilda (~)</option>
            <option value=":">Colon (:)</option>
            <option value=";">Semi colon (;)</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>String character</Form.Label>
          <Form.Select value={scheme.string_character} name="string_character" onChange={onChange}>
            <option value='"'>Double quote (")</option>
            <option value="'">Single quote (')</option>
          </Form.Select>
        </Form.Group>
      </div>
    )}

    <div className="detail">
      {scheme && scheme.columns && (
        <>
          <h3 className="mt-5">Schema columns</h3>
          <div className="grid">
            {scheme.columns.map((n) => (
              n.action !== 'DELETE' && <Fragment key={n.id}>
                <Form.Group>
                  <Form.Label>Column name</Form.Label>
                  <Form.Control value={n.name} name="name" onChange={onColumnChange(n.id)} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={n.type} name="type" onChange={onColumnChange(n.id)}>
                    <option value="FULL_NAME">Full name</option>
                    <option value="JOB">Job</option>
                    <option value="EMAIL">Email</option>
                    <option value="DOMAIN_NAME">Domain name</option>
                    <option value="PHONE_NUMBER">Phone number</option>
                    <option value="COMPANY_NAME">Company name</option>
                    <option value="TEXT">Text</option>
                    <option value="INTEGER">Integer</option>
                    <option value="ADDRESS">Address</option>
                  </Form.Select>
                </Form.Group>

                <div>
                  {n.type === 'INTEGER' && n.extra_data && (
                    <div className="d-flex">
                      <Form.Group style={{ marginRight: '8px' }}>
                        <Form.Label>From</Form.Label>
                        <Form.Control type="number" value={n.extra_data.start_range} name="start_range" onChange={onExtraDataChange(n.id)} />
                      </Form.Group>

                      <Form.Group style={{ marginLeft: '8px' }}>
                        <Form.Label>To</Form.Label>
                        <Form.Control type="number" value={n.extra_data.end_range} name="end_range" onChange={onExtraDataChange(n.id)} />
                      </Form.Group>
                    </div>
                  )}
                </div>

                <div className="d-flex">
                  <Form.Group>
                    <Form.Label>Order</Form.Label>
                    <Form.Control type="number" value={n.order} name="order" onChange={onColumnChange(n.id)} />
                  </Form.Group>
                  <p className="delete delete-column" onClick={onRemoveColumn(n.id)}>Delete</p>
                </div>
              </Fragment>
            ))}
          </div>

          {/* New Column */}
          <div className="divider" />
          <div className="grid">
            <Form.Group>
              <Form.Label>Column name</Form.Label>
              <Form.Control value={newColumn.name} name="name" onChange={onNewColumnChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={newColumn.type} name="type" onChange={onNewColumnChange}>
                <option value="FULL_NAME">Full name</option>
                <option value="JOB">Job</option>
                <option value="EMAIL">Email</option>
                <option value="DOMAIN_NAME">Domain name</option>
                <option value="PHONE_NUMBER">Phone number</option>
                <option value="COMPANY_NAME">Company name</option>
                <option value="TEXT">Text</option>
                <option value="INTEGER">Integer</option>
                <option value="ADDRESS">Address</option>
              </Form.Select>
            </Form.Group>

            <div>
              {newColumn.type === 'INTEGER' && newColumn.extra_data && (
                <div className="d-flex">
                  <Form.Group style={{ marginRight: '8px' }}>
                    <Form.Label>From</Form.Label>
                    <Form.Control type="number" value={newColumn.extra_data.start_range} name="start_range" onChange={onNewColumnExtraDataChange} />
                  </Form.Group>

                  <Form.Group style={{ marginLeft: '8px' }}>
                    <Form.Label>To</Form.Label>
                    <Form.Control type="number" value={newColumn.extra_data.end_range} name="end_range" onChange={onNewColumnExtraDataChange} />
                  </Form.Group>
                </div>
              )}
            </div>

            <Form.Group>
              <Form.Label>Order</Form.Label>
              <Form.Control type="number" value={newColumn.order} name="order" onChange={onNewColumnChange} />
            </Form.Group>
          </div>

          <Button type="primary" className="mt-4" onClick={onAddColumn}>Add column</Button>
        </>
      )}
    </div>

    <ToastContainer position="bottom-center">
      <Toast onClose={() => setShow(false)} bg="info" show={show} delay={5000}  autohide>
        <Toast.Body>
          <p>Successfully Added</p>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  </div>
};
