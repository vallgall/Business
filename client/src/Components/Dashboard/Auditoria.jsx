import React, { useEffect, useState } from 'react';
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import { CSVLink } from 'react-csv';


const Auditoria = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3002/auditoria')
            .then((response) => {
                setLogs(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los logs:', error);
            });
    }, []);

    return (
        <div className='containerTable'>
            <div className='dashboard col-lg-3 col-md-4 col-sm-12'><Dashboard /></div>

            <div className="table-container col-lg-9 col-md-8 col-sm-12">
                <div className="table">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID del Log</th>
                                <th>ID del Usuario</th>
                                <th>Descripción de la Acción</th>
                                <th>Fecha de la Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{log.log_id}</td>
                                    <td>{log.user_id}</td>
                                    <td>{log.action_description}</td>
                                    <td>{log.action_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CSVLink data={logs} filename={"logs.csv"}>
                        Descargar CSV
                    </CSVLink>
                </div>
            </div>
        </div>
    );
}
export default Auditoria;
