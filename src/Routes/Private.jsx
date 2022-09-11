import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Pages/Home';
import Register from '../Pages/Register';

const Private = () => {

    const token = window.localStorage.getItem('acces_token')
    const navigate = useNavigate()

    if(token) {
        return <Home />
    } else {
        navigate('/register')
        return <Register />
    }
}

export default Private;