import React, { Component } from "react";

import Form from "./Form";
import Tarefas from "./Tarefas";

import "./main.css";
import './alerts.css';

export default class Main extends Component {
  state = {
    novaTarefa: "",
    tarefas: [],
    index: -1,
    mensagemErro: "",
    erroVisivel: false,
    mensagemSucesso: "",
    sucessoVisivel: false,
  };

  componentDidMount() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas"));

    if (!tarefas) return;
    this.setState({ tarefas });
  }

  componentDidUpdate(prevProps, prevState) {
    const { tarefas } = this.state;

    if (tarefas === prevState.tarefas) return;

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { tarefas, index } = this.state;
    let { novaTarefa } = this.state;
    novaTarefa = novaTarefa.trim();

    if (novaTarefa === "") {
      this.mostrarErro(
        "Por favor, preencha o campo antes de adicionar a tarefa."
      );
      return;
    }

    if (tarefas.indexOf(novaTarefa) !== -1) {
      this.mostrarErro("Essa tarefa já existe!");
      return;
    }

    const novasTarefas = [...tarefas];

    if (index === -1) {
      this.setState({
        tarefas: [...novasTarefas, novaTarefa],
        novaTarefa: "",
      });
      this.mostrarSucesso("Tarefa adicionada com sucesso!");
    } else {
      novasTarefas[index] = novaTarefa;

      this.setState({
        tarefas: [...novasTarefas],
        index: -1,
        novaTarefa: "",
      });
      this.mostrarSucesso("Tarefa editada com sucesso!");
    }

    if (index === -1) {
      this.setState({
        tarefas: [...novasTarefas, novaTarefa],
        novaTarefa: "",
        mensagemErro: "", // Limpa erro após sucesso
      });
    } else {
      novasTarefas[index] = novaTarefa;
      this.setState({
        tarefas: [...novasTarefas],
        index: -1,
        novaTarefa: "",
        mensagemErro: "", // Limpa erro após edição
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      novaTarefa: e.target.value,
    });
  };

  handleEdit = (e, index) => {
    const { tarefas } = this.state;
    this.setState({
      index,
      novaTarefa: tarefas[index],
    });
  };

  handleDelete = (e, index) => {
    const { tarefas } = this.state;
    const novasTarefas = [...tarefas];
    novasTarefas.splice(index, 1);

    this.setState({
      tarefas: [...novasTarefas],
    });
  };

  //mensagem de sucesso
  mostrarSucesso = (mensagem) => {
    this.setState({ mensagemSucesso: mensagem, sucessoVisivel: true });

    setTimeout(() => {
      this.setState({ sucessoVisivel: false });

      setTimeout(() => {
        this.setState({ mensagemSucesso: "" });
      }, 500);
    }, 3000);
  };

  //mensagem de erro
  mostrarErro = (mensagem) => {
    this.setState({ mensagemErro: mensagem, erroVisivel: true });

    setTimeout(() => {
      this.setState({ erroVisivel: false });

      setTimeout(() => {
        this.setState({ mensagemErro: "" });
      }, 500); // espera o fade-out terminar
    }, 3000); // visível por 3 segundos
  };

  render() {
    const { novaTarefa, tarefas } = this.state;

    return (
      <div className="main">
        <h1>Lista de Tarefas</h1>

        {this.state.mensagemErro && (
          <div
            className={`alert-erro ${
              !this.state.erroVisivel ? "fade-out" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2v-6z" />
            </svg>
            <span>{this.state.mensagemErro}</span>
          </div>
        )}

        {this.state.mensagemSucesso && (
          <div
            className={`alert-sucesso ${
              !this.state.sucessoVisivel ? "fade-out" : ""
            }`}
          >
            {this.state.mensagemSucesso}
          </div>
        )}

        <Form
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          novaTarefa={novaTarefa}
        />

        <Tarefas
          tarefas={tarefas}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
        />
      </div>
    );
  }
}
