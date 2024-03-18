import React, { useState, useEffect } from 'react'
import './Login.css'
import '../../App.css'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import video from '../LoginAssets/video.mp4'
import logo from '../LoginAssets/logo.png'


import {FaUserShield} from 'react-icons/fa'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {AiOutlineSwapRight} from 'react-icons/ai'

const Login = () => {

    const[loginusername, setloginUserName]=useState('')
    const[loginpassword, setloginPassword]=useState('')
    const navigateTo = useNavigate()
    const [loginStatus, setLoginStatus] = useState('')
    const [statusHolder, setstatusHolder] = useState('message')

    const loginUser = (e)=>{
    
        e.preventDefault();
        Axios.post('http://localhost:3002/login', {
            LoginUserName: loginusername,
            LoginPassword: loginpassword
        }). then((response)=>{
            console.log()
            if(response.data.message || loginusername == '' || loginpassword == '') {
                navigateTo('/')
                setLoginStatus('Credeciales no existen')
            }else{
                localStorage.setItem('userRole', response.data.userRole);
                navigateTo('/dashboard') 
                
            }
        })
    }

    useEffect(()=>{
        if(loginStatus !== ''){
            setstatusHolder('showMessage') 
            setTimeout(() =>{
            setstatusHolder('message') 
            },4000);
        }
    }, [loginStatus])

    // Lets Ccedrthie jorm on sdomte
    const onSubmit = ()=>{
        setLoginUserName('')
        setLoginPassword('')
    }

    return (
        <div className='loginPage flex'>
            <div className="container flex">

                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>

                    <div className="textDiv">
                        <h2 className='title'>Potencia en cada pieza</h2>
                        <p>Rendimiento sin límites</p>
                    </div>

                    <div className="footerDiv flex">
                        <span className="text">¿No tienes un cuenta?</span>
                        <Link to={'/register'}>
                        <button className='btn'>Registrarse</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image"/>
                        <h3>¡Bienvenido de vuelta!</h3>
                    </div>

                    <form action="" className='form grid' onSubmit={onSubmit}>
                        <span className={statusHolder}>{loginStatus}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">Usuario</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input type="text" id='username' placeholder='Ingresar tu usuario' onChange={(event)=>{
                                    setloginUserName(event.target.value)
                                }}/>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input flex">
                            <BsFillShieldLockFill className='icon'/>
                            <input type="password" id='password' placeholder='Ingresa tu contraseña' onChange={(event)=>{
                                    setloginPassword(event.target.value)
                                }}/>
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick={loginUser}>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>

                        <span className='forgotPassword'>
                        ¿Olvidaste tu contraseña? <a href="">Clic Aqui</a>
                        </span>
                    </form>

                </div>

                
                
            </div>
        </div>
    )
}

export default Login