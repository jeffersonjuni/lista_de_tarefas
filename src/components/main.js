import React, { Component } from "react";
import Form from "./Form";
import Tarefas from "./Tarefas";

import "./main.css";
import './alerts.css';

export default class Main extends Component {
  state = {
    novaTarefa: "",
    tarefas: [],
    concluidas: [],
    index: -1,
    mensagemErro: "",
    erroVisivel: false,
    mensagemSucesso: "",
    sucessoVisivel: false,
  };

  componentDidMount() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas"));
    const concluidas = JSON.parse(localStorage.getItem("concluidas"));

    if (tarefas) {
      this.setState({
        tarefas,
        concluidas: concluidas || Array(tarefas.length).fill(false),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tarefas, concluidas } = this.state;
    if (tarefas !== prevState.tarefas)
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    if (concluidas !== prevState.concluidas)
      localStorage.setItem("concluidas", JSON.stringify(concluidas));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { tarefas, concluidas, index } = this.state;
    let { novaTarefa } = this.state;
    novaTarefa = novaTarefa.trim();

    if (novaTarefa === "") {
      this.mostrarErro("Por favor, preencha o campo antes de adicionar a tarefa.");
      return;
    }

    if (tarefas.indexOf(novaTarefa) !== -1 && index === -1) {
      this.mostrarErro("Essa tarefa já existe!");
      return;
    }

    const novasTarefas = [...tarefas];
    const novasConcluidas = [...concluidas];

    if (index === -1) {
      novasTarefas.push(novaTarefa);
      novasConcluidas.push(false);

      this.setState({
        tarefas: novasTarefas,
        concluidas: novasConcluidas,
        novaTarefa: "",
        mensagemErro: "",
      });
      this.mostrarSucesso("Tarefa adicionada com sucesso!");
    } else {
      novasTarefas[index] = novaTarefa;

      this.setState({
        tarefas: novasTarefas,
        index: -1,
        novaTarefa: "",
        mensagemErro: "",
      });
      this.mostrarSucesso("Tarefa editada com sucesso!");
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
    const tarefas = [...this.state.tarefas];
    const concluidas = [...this.state.concluidas];
    tarefas.splice(index, 1);
    concluidas.splice(index, 1);
    this.setState({ tarefas, concluidas });
  };

  handleToggleConcluida = (index) => {
    const concluidas = [...this.state.concluidas];
    concluidas[index] = !concluidas[index];
    this.setState({ concluidas });
  };

  mostrarSucesso = (mensagem) => {
    this.setState({ mensagemSucesso: mensagem, sucessoVisivel: true });

    setTimeout(() => {
      this.setState({ sucessoVisivel: false });

      setTimeout(() => {
        this.setState({ mensagemSucesso: "" });
      }, 500);
    }, 3000);
  };

  mostrarErro = (mensagem) => {
    this.setState({ mensagemErro: mensagem, erroVisivel: true });

    setTimeout(() => {
      this.setState({ erroVisivel: false });

      setTimeout(() => {
        this.setState({ mensagemErro: "" });
      }, 500);
    }, 3000);
  };

  render() {
    const { novaTarefa, tarefas, concluidas } = this.state;

    return (
      <div className="main">
        <h1>Lista de Tarefas</h1>

        {this.state.mensagemErro && (
          <div className={`alert-erro ${!this.state.erroVisivel ? "fade-out" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2v-6z" />
            </svg>
            <span>{this.state.mensagemErro}</span>
          </div>
        )}

        {this.state.mensagemSucesso && (
          <div className={`alert-sucesso ${!this.state.sucessoVisivel ? "fade-out" : ""}`}>
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
          concluidas={concluidas}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
          handleToggleConcluida={this.handleToggleConcluida}
        />
      </div>
    );
  }
}
