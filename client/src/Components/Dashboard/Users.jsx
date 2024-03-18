import React, { useEffect, useState } from 'react';
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import { CSVLink } from 'react-csv';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3002/users').then((response) => {
            console.log(response.data)
            setUsers(response.data);
        });
    }, []);

    const handleRoleChange = (e, userId) => {
        const newRole = e.target.value;
        Axios.post('http://localhost:3002/users/updateRole', {
            userId: userId,
            newRole: newRole
        }).then((response) => {
            if (response.data.success) {
                alert('El rol del usuario ha sido actualizado con éxito.');
            } else {
                alert('Hubo un error al actualizar el rol del usuario.');
            }
            Axios.get('http://localhost:3002/users').then((response) => {
                setUsers(response.data);
            });
        });
    }
    
    const handleDelete = async (userId) => {
        const confirmation = window.confirm('Al eliminar este usuario, también se eliminarán todos los registros asociados a él. ¿Estás seguro de que quieres continuar?');
        if (confirmation) {
            try {
                const response = await Axios.post('http://localhost:3002/users/delete', {
                    userId: userId
                });
                if (response.data.success) {
                    alert('El usuario y todos sus registros asociados han sido eliminados con éxito.');
                    const response = await Axios.get('http://localhost:3002/users');
                    setUsers(response.data);
                } else {
                    alert('Hubo un error al eliminar el usuario y sus registros asociados.');
                }
            } catch (error) {
                alert('Hubo un error al eliminar el usuario y sus registros asociados.');
            }
        }
    }
    
    return (
        <div className='containerTable'>
            <div className='dashboard col-lg-3 col-md-4 col-sm-12'><Dashboard /></div>

            <div className="table-container col-lg-9 col-md-8 col-sm-12">
                <div className="table">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo  electrónico</th>
                                <th>Role</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select value={user.role} onChange={(e) => handleRoleChange(e, user.user_id)}>
                                            <option value="admin">Administrador</option>
                                            <option value="vendor">Vendedor</option>
                                            <option value="buyer">Comprador</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user.user_id)}>Delete</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CSVLink data={users} filename={"users.csv"}>
                        Descargar CSV
                    </CSVLink>
                </div>
            </div>
        </div>
    );
}

export default Users;