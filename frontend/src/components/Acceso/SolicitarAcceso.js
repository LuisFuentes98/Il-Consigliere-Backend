import React, { Component } from 'react';
import axios from 'axios';
import { myAlert } from '../../helpers/alert';
import $ from 'jquery';

export default class SolicitarAcceso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: '',
            correo: '',
            isLoading: true,
            registrado: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
    }

    handleInputChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post('/correo/verificar_correo', { correo: this.state.correo })
            .then(respo => {
                if (!respo.data.taken) {
                    axios.post('usuario/solicitar_acceso', {cedula: this.state.cedula, correo: this.state.correo})
                    .then(res=>{
                        if(res.data.success){
                            myAlert('Atencion', 'Solicitud enviada exitosamente, espere un correo del administrador.', 'success')
                            $('#SolAcceso').modal('hide');
                                this.button.current.removeAttribute('disabled', 'disabled');
                                this.button.current.style.cursor = 'default';
                        }else{
                            myAlert('Atencion', 'Error interno del servidor.', 'error');
                            this.setState({'correo': ''});
                        }
                    })
                } else {
                    myAlert('Atención', 'Ya existe un usuario con este correo en el sistema.', 'warning');
                    this.setState({'correo': ''});
                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        $('#SolAcceso').on('shown.bs.modal', function () {
            $('#modal-input').focus();
        });
        return (
            <>
                <div className='d-flex justify-content-center mt-2'>
                    <button type='button' className="my-link" data-toggle="modal" data-target="#SolAcceso">
                        Solicitar Acesso al sistema.
                    </button>
                </div>
                <div className="modal fade" id="SolAcceso" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content modal-border">
                            <div className="modal-body">
                                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                                <h4 className="modal-title text-center mb-4">Solicitud de acceso al sistema</h4>
                                <p>Favor estar atento a su correo electrónico para recibir el link de registro.</p>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="cedula"
                                            placeholder="Cédula" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" required maxLength="200" name="correo"
                                            placeholder="Correo electrónico" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.correo} />
                                        <p className='my-muted'>*Escribe el correo al que desea recibir la información de los consejos.</p>
                                    </div>
                                    <div className="form-group d-flex justify-content-around">
                                        <button type="submit" ref={this.button} className="btn btn-outline-primary mt-4 my-size">Enviar Solicitud</button>
                                        <button type="button" className="btn btn-outline-secondary my-size mt-4" data-dismiss="modal">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
