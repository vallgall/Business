import './App.css'
import Dashboard from './Components/Dashboard/Dashboard'
import Users from './Components/Dashboard/Users'
import Login from './Components/Login/Login'
import Inventario from './Components/Dashboard/Inventario'
import Ventas from './Components/Dashboard/Ventas'
import Register from './Components/Register/Register'
import Auditoria from './Components/Dashboard/Auditoria'
import 'bootstrap/dist/css/bootstrap.min.css';


import {
  createBrowserRouter,
  RouterProvider
  }from  'react-router-dom';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <div><Login/></div>
    },
    {
      path: '/register',
      element: <div><Register/></div>
    },
    {
      path: '/dashboard',
      element :< div><Dashboard/></div>
    },
    {
      path: '/users',
      element :< div><Users/></div>
    },
    {
      path: '/users/updateRole',
      element :< div><Users/></div>
    },
    {
      path: '/users/delete',
      element :< div><Users/></div>
    },
    {
      path: '/productinventory',
      element :< div><Inventario/></div>
    },
    {
      path: '/productinventory/delete',
      element :< div><Inventario/></div>
    },
    {
      path: '/productinventory/update',
      element :< div><Inventario/></div>
    },
    {
      path: '/productinventory/add',
      element :< div><Inventario/></div>
    },
    {
      path: '/ventas',
      element :< div><Ventas/></div>
    },
    {
      path: '/ventas/delete',
      element :< div><Ventas/></div>
    },
    {
      path: '/ventas/update',
      element :< div><Ventas/></div>
    },
    {
      path: '/ventas/add',
      element :< div><Ventas/></div>
    },
    {
      path: '/auditoria',
      element :< div><Auditoria/></div>
    }
  ])

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>

  )
}

export default App