import React, { useEffect, useState } from 'react';
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import { Modal, Button, Form } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

function ProductInventory() {
    const [inventorylog, setInventorylog] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formState, setFormState] = useState({
        product_name: '',
        description: '',
        quantity_in_stock: '',
        price: '',
        entry_date: '',
        is_entry: ''
    });

    useEffect(() => {
        Axios.get('http://localhost:3002/productinventory').then((response) => {
            console.log(response.data)
            setInventorylog(response.data);
        });
    }, []);

    const handleDelete = (product_id, quantity_in_stock) => {
        Axios.post('http://localhost:3002/productinventory/delete', {
            product_id: product_id,
            quantity_in_stock: quantity_in_stock
        }).then((response) => {
            if (response.data.success) {
                alert('El registro del inventario ha sido eliminado con éxito.');
            } else {
                alert('Hubo un error al eliminar el registro del inventario.');
            }
            Axios.get('http://localhost:3002/productinventory').then((response) => {
                setInventorylog(response.data);
            });
        });
    }

    const handleFormChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormState({
            ...formState,
            [e.target.name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentItem) {
            Axios.post('http://localhost:3002/productinventory/update', {
                ...formState
            }).then((response) => {
                if (response.data.success) {
                    alert('El registro del inventario ha sido actualizado con éxito.');
                } else {
                    alert('Hubo un error al actualizar el registro del inventario.');
                }
                Axios.get('http://localhost:3002/productinventory').then((response) => {
                    setInventorylog(response.data);
                });
            });
        } else {
            Axios.post('http://localhost:3002/productinventory/add', {
                ...formState
            }).then((response) => {
                if (response.data.success) {
                    alert('El registro del inventario ha sido agregado con éxito.');
                } else {
                    alert('Hubo un error al agregar el registro del inventario.');
                }
                Axios.get('http://localhost:3002/productinventory').then((response) => {
                    setInventorylog(response.data);
                });
            });
        }
        setModalShow(false);
    }

    useEffect(() => {
        if (currentItem) {
            setFormState(currentItem);
        } else {
            setFormState({
                product_name: '',
                description: '',
                quantity_in_stock: '',
                price: '',
                entry_date: '',
                is_entry: ''
            });
        }
    }, [currentItem]);

    return (
        <div className='containerTable'>
            <div className='dashboard col-lg-3 col-md-4 col-sm-12'><Dashboard /></div>

            <div className="table-container col-lg-9 col-md-8 col-sm-12">
                <div className="table">
                    <Button variant="primary" onClick={() => { setCurrentItem(null); setModalShow(true); }}>
                        Agregar
                    </Button>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre del producto</th>
                                <th>Descripción</th>
                                <th>Cantidad en inventario</th>
                                <th>Precio</th>
                                <th>Fecha de entrada</th>
                                <th>Entrada</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventorylog.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_id}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity_in_stock}</td>
                                    <td>{item.price}</td>
                                    <td>{item.entry_date}</td>
                                    <td>{item.is_entry ? 'Sí' : 'No'}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => { setCurrentItem(item); setModalShow(true); }}>
                                            Editar
                                        </Button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.product_id, item.quantity_in_stock)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CSVLink data={inventorylog} filename={"inventorylog.csv"}>
                        Descargar CSV
                    </CSVLink>
                </div>
            </div>
            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentItem ? 'Editar producto' : 'Agregar producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Nombre del producto</Form.Label>
                            <Form.Control type="text" name="product_name" value={formState.product_name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" name="description" value={formState.description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group controlId="formQuantityInStock">
                            <Form.Label>Cantidad en inventario</Form.Label>
                            <Form.Control type="number" name="quantity_in_stock" value={formState.quantity_in_stock} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" name="price" value={formState.price} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group controlId="formEntryDate">
                            <Form.Label>Fecha de entrada</Form.Label>
                            <Form.Control type="date" name="entry_date" value={formState.entry_date} onChange={handleFormChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {currentItem ? 'Editar' : 'Agregar'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductInventory;