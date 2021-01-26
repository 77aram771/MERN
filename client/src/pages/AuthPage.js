import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [from, setFrom] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        console.log('Error', error)
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = (event) => {
        setFrom({...from, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', "POST", {...from})
            message(data.message)
        } catch (e) {
        }
    }

    const logInHandler = async () => {
        try {
            const data = await request('/api/auth/login', "POST", {...from})
            auth.login(data.token, data.userId)
        } catch (e) {
        }
    }

    return (
        <div className='row'>
            <div className="col s6 offset-s3">
                <h1>Slice Source</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field ">
                                <input
                                    placeholder="Enter Email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="validate yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="first_name">Email</label>
                            </div>
                            <div className="input-field ">
                                <input
                                    placeholder="Enter Password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="validate yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="first_name">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            onClick={logInHandler}
                            disabled={loading}
                        >
                            Enter
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
