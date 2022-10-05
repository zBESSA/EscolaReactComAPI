import React, {Component} from 'react';
import axios from 'axios';
import './CrudCurso.css';
import Main from "../template/Main";

const title = "Cadastro de Cursos";

const urlAPI = "http://localhost:5014/api/curso";

export default function CrudCurso(){
    const initialState = {
        curso: { id: 0, codCurso: 0, nomeCurso: '', periodo: ''},
        lista: []
    }

    const stateCurso = { ...initialState}
    
    const componentDidMount = async () => {
        return await axios(urlAPI)
        .then((resp) => resp.data)
        .catch((err) =>err);
    }

    const limpar = () => stateCurso({ curso: initialState.curso })

    const salvar = () => {
        const metodo = curso.id ? 'put' : 'post';
        const url = curso.id ? `${urlAPI}/${curso.id}` : urlAPI;

        const curso = stateCurso.curso;
        curso.codCurso = Number(curso.codCurso);

        axios[metodo](url, curso)
            .then(resp => {
                const lista = getListaAtualizada(resp.data)
                this.stateCurso({ curso: initialState.curso, lista })
            })
    }

    const getListaAtualizada = (curso, add = true) => {
        const lista = stateCurso.lista.filter(a => a.id !== curso.id);
        if (add) lista.unshift(curso);
        return lista;
    }

    const atualizaCampo = evento => {
        //clonar curso a partir do state, para não alterar o state diretamente
        const curso = { ...curso};
        // usar o atributo NAME do imput identificar o campo a ser atualizado
        curso[evento.target.name] = evento.target.value;
        //atualizar o state
        stateCurso({curso});
    }

    const atualizarCurso = (curso) => stateCurso(curso)

    const remover = (curso) => {
        const url = urlAPI + "/" + curso.id;
        if (window.confirm("Confirma remoção do curso: " + curso.nomeCurso)) {
            console.log("entrou no confirme da tela")

            axios['delete'](url, curso)
                .then(resp => {
                    const lista = getListaAtualizada(curso, false)
                    stateCurso({ curso: initialState.curso, lista })
                })
        }
    }
    
    const renderForm = () => {
        const curso = stateCurso.curso;

        return (
            <div className="inclui-container">
                <label> Código: </label>
                <input
                    type="text"
                    id="codCurso"
                    placeholder="Código do curso"
                    className="form-input"
                    name="codCurso"
                    value={curso.codCurso}
                    onChange={ e => atualizaCampo(e)}
                />

                <label> Nome: </label>
                <input
                    type="text"
                    id="nomeCurso"
                    placeholder="Nome do curso"
                    className="form-input"
                    name="nome"
                    value={curso.nomeCurso}
                    onChange={ e => this.atualizaCampo(e)}
                />

                <label> periodo: </label>
                <input
                    type="text"
                    id="periodo"
                    placeholder="V"
                    className="form-input"
                    name="periodo"
                    value={curso.periodo}
                    onChange={ e => this.atualizaCampo(e)}
                />

                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                        Salvar
                </button>

                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                        Cancelar
                </button>

            </div>
        )
    }

    const renderTable = () => {
        return(
            <div className="listagem">
                <table className="listaCursos" id="tblListaCursos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloCodigo">Código</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloPeriodo">Periodo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stateCurso.lista.map(
                            (curso) =>
                            <tr key={curso.id}>
                                <td>{curso.codCurso}</td>
                                <td>{curso.nome}</td>
                                <td>{curso.periodo}</td>
                                <td>
                                    <button onClick={() => this.carregar(curso)}>
                                        Altera
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => this.remover(curso)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
        return(
            <Main title={title}>
                {renderForm()}
                {renderTable()}
            </Main>
        )

}