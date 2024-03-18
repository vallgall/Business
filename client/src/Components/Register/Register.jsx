import React, { useState }   from 'react'
import './Register.css'
import '../../App.css'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import video from '../LoginAssets/video.mp4'
import logo from '../LoginAssets/logo.png'

import {FaUserShield} from 'react-icons/fa'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {AiOutlineSwapRight} from 'react-icons/ai'
import {MdMarkEmailRead} from 'react-icons/md'

const Register = () => {

   
    const[email, setEmail]=useState('')
    const[username, setUserName]=useState('')
    const[password, setPassword]=useState('')
    const navigateTo = useNavigate()
    
    const createUser = (e)=>{
        e.preventDefault()
        Axios.post('http://localhost:3002/register', {
            Email: email,
            UserName: username,
            Password: password
            }). then(()=>{
                navigateTo('/') 
                setEmail('')
                setUserName('')
                setEmail('')
            })
    }

    return (
        <div className='RegisterPage flex'>
            <div className="container flex">

                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>

                    <div className="textDiv">
                        <h2 className='title'>Potencia en cada pieza</h2>
                        <p>Rendimiento sin límites</p>
                    </div>

                    <div className="footerDiv flex">
                        <span className="text">¿Ya tienes una cuenta?</span>
                        <Link to={'/'}>
                        <button className='btn'>Iniciar Sesión</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image"/>
                        <h3>¡Dejanos conocerte!</h3>
                    </div>

                    <form action="" className='form grid'>
                        <div className="inputDiv">
                            <label htmlFor="email">Correo electronico</label>
                            <div className="input flex">
                                <MdMarkEmailRead className='icon'/>
                                <input type="email" id='email' placeholder='Ingresar tu correo electronico' onChange={(event)=>{
                                    setEmail(event.target.value)
                                }}/>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="username">Usuario</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input type="text" id='username' placeholder='Ingresar tu usuario'onChange={(event)=>{
                                    setUserName(event.target.value)
                                }}/>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input flex">
                            <BsFillShieldLockFill className='icon'/>
                            <input type="password" id='password' placeholder='Ingresa tu contraseña' onChange={(event)=>{
                                    setPassword(event.target.value)
                                }}/>
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick={createUser}>
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

export default Register