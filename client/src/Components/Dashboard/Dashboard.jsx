import React, { useState, useEffect } from 'react'
import { FaUser } from "react-icons/fa"
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { MdInventory } from "react-icons/md"
import { MdPointOfSale } from "react-icons/md"
import { FaCartFlatbed } from "react-icons/fa6"
import { HiDocumentReport } from "react-icons/hi"
import { FaSignOutAlt } from "react-icons/fa"


const Dashboard = () => {
    const navigateTo = useNavigate()
    const userRole = localStorage.getItem('userRole');
    const handleLogout = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3002/logout')
            .then((response) => {
                // Aquí puedes manejar la respuesta del servidor
                // Por ejemplo, puedes verificar si el cierre de sesión fue exitoso
                if (response.data.success) {
                    navigateTo('/'); // Redirige al usuario a la página de inicio de sesión
                } else {
                    console.log('Error al cerrar la sesión');
                }
            })
            .catch((error) => {
                console.log('Error al cerrar la sesión', error);
            });
    }

    return (
        <div className='dashboard'>
            <div class="navigation">
                <ul>
                    {userRole === 'admin' && (
                        <li>
                            <Link to={'/users'}>
                                <a href="#">
                                    <span class="icon"><FaUser className='icon' /></span>
                                    <span class="title">Usuarios</span>
                                </a>
                            </Link>
                        </li>
                    )}
                    {(userRole === 'admin' || userRole === 'vendor' || userRole === 'buyer') && (
                        <li>
                            <Link to={'/productinventory'}>
                                <a href="#">
                                    <span class="icon"><FaCartFlatbed className='icon' /></span>
                                    <span class="title">Inventario</span>
                                </a>
                            </Link>
                        </li>
                    )}
                    {(userRole === 'admin' || userRole === 'buyer' || userRole === 'vendor') && (
                        <li>
                            <Link to={'/ventas'}>
                                <a href="#">
                                    <span class="icon"><MdPointOfSale className='icon' /></span>
                                    <span class="title">Ventas</span>
                                </a>
                            </Link>
                        </li>
                    )}
                    {userRole === 'admin' && (
                        <li>
                            <Link to={'/auditoria'}>
                                <a href="#">
                                    <span class="icon"><HiDocumentReport className='icon' /></span>
                                    <span class="title">Auditoria</span>
                                </a>
                            </Link>
                        </li>
                    )}
                    <li>
                        <a href="#" onClick={handleLogout}>
                            <span class="icon"><FaSignOutAlt className='icon' /></span>
                            <span class="title">Salir</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="table-container"></div>
        </div>
    )
}

export default Dashboard