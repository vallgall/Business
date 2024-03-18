import React, { useEffect, useState } from 'react';
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import { Modal, Button, Form } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [currentSale, setCurrentSale] = useState(null);
    const [formState, setFormState] = useState({
        sale_id: '',
        user_id: '',
        product_id: '',
        quantity_sold: '',
        sale_date: ''
    });

    useEffect(() => {
        Axios.get('http://localhost:3002/ventas').then((response) => {
            console.log(response.data)
            setVentas(response.data);
        });
    }, []);

    const handleDeleteSale = (saleId, productId) => {
        Axios.post('http://localhost:3002/ventas/delete', {
            saleId: saleId,
            productId: productId
        }).then((response) => {
            if (response.data.success) {
                alert('La venta ha sido eliminada con éxito.');
            } else {
                alert('Hubo un error al eliminar la venta.');
            }
            Axios.get('http://localhost:3002/ventas').then((response) => {
                setVentas(response.data);
            });
        });
    }

    const handleFormChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentSale) {
            // Si currentSale no es null, estamos editando una venta existente
            Axios.post('http://localhost:3002/ventas/update', {
                ...formState,
            }).then((response) => {
                if (response.data.success) {
                    alert('La venta ha sido actualizada con éxito.');
                } else {
                    alert('Hubo un error al actualizar la venta.');
                }
                Axios.get('http://localhost:3002/ventas').then((response) => {
                    setVentas(response.data);
                });
            });
        } else {
            // Si currentSale es null, estamos agregando una nueva venta
            const { user_id, product_id, quantity_sold, sale_date } = formState;
            Axios.post('http://localhost:3002/ventas/add', {
                user_id, product_id, quantity_sold, sale_date
            }).then((response) => {
                if (response.data.success) {
                    alert('La venta ha sido agregada con éxito.');
                } else {
                    alert('Hubo un error al agregar la venta.');
                }
                Axios.get('http://localhost:3002/ventas').then((response) => {
                    setVentas(response.data);
                });
            });
        }
        setModalShow(false);
    }

    useEffect(() => {
        if (currentSale) {
            setFormState(currentSale);
        } else {
            setFormState({
                sale_id: '',
                user_id: '',
                product_id: '',
                quantity_sold: '',
                sale_date: ''
            });
        }
    }, [currentSale]);

    return (
        <div className='containerTable'>
            <div className='dashboard col-lg-3 col-md-4 col-sm-12'><Dashboard /></div>

            <div className="table-container col-lg-9 col-md-8 col-sm-12">
                <div className="table">
                    <Button variant="primary" onClick={() => { setCurrentSale(null); setModalShow(true); }}>
                        Agregar
                    </Button>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id de la venta</th>
                                <th>Id del usuario</th>
                                <th>Id del producto</th>
                                <th>Cantidad vendida</th>
                                <th>Fecha de la venta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta, index) => (
                                <tr key={index}>
                                    <td>{venta.sale_id}</td>
                                    <td>{venta.user_id}</td>
                                    <td>{venta.product_id}</td>
                                    <td>{venta.quantity_sold}</td>
                                    <td>{venta.sale_date}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => { setCurrentSale(venta); setModalShow(true); }}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDeleteSale(venta.sale_id, venta.product_id)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CSVLink data={ventas} filename={"ventas.csv"}>
                        Descargar CSV
                    </CSVLink>
                </div>
            </div>

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentSale ? 'Editar Venta' : 'Agregar Venta'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Id del usuario</label>
                            <input type="text" name="user_id" value={formState.user_id} onChange={handleFormChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Id del producto</label>
                            <input type="text" name="product_id" value={formState.product_id} onChange={handleFormChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Cantidad vendida</label>
                            <input type="text" name="quantity_sold" value={formState.quantity_sold} onChange={handleFormChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Fecha de la venta</label>
                            <input type="date" name="sale_date" value={formState.sale_date} onChange={handleFormChange} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {currentSale ? 'Actualizar' : 'Agregar'}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Ventas;