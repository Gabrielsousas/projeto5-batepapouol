let activeUser;

let mensagens;

const principal = document.querySelector("main");
principal.innerHTML = "";

getUserName();



function getUserName() {
  const userName = prompt("Qual seu nome?");
  axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {
      name: userName,
    })
    .then((response) => {
      console.log(response.data);
      activeUser = userName;
      setInterval(() => {
        verificaUserOnline();
      }, 5000);
      setInterval(() => {
        pegarMensagensNoServidor();
      }, 3000);
    })

    .catch((error) => {
      const errorMesage = error.response.status;
      if (errorMesage === 400) {
        alert("Este nome de usuário já está sendo utilizado");
      }
      window.location.reload;
      console.log(error);
    });
}

function verificaUserOnline() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
      name: activeUser,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      alert("você foi desconectado")
      window.location.reload;
    });
}

function pegarMensagensNoServidor() {
  axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then((response) => {
      mensagens = response.data;
      principal.innerHTML = "";
      adicionarMensagemNoHTML();
      const lastChild = principal.lastElementChild;
      lastChild.scrollIntoView();
    })
    .catch((error) => {
      console.log(error);
      window.location.reload();
    });
}

function adicionarMensagemNoHTML() {
  for (let i = 0; i < mensagens.length; i++) {
    const tempo = `(${mensagens[i].time})`;
    const sender = `${mensagens[i].from}`;
    const texto = `${mensagens[i].text}`;
    const receiver = `${mensagens[i].to}`;

    if (mensagens[i].type === "status") {
      principal.innerHTML += `
        <div class="mensagem-status" data-test="message">
          <span class="time-style">${tempo}</span>
          <span class="name-style">${sender}</span> 
            ${texto} 
        </div>
    `;
    } else if (mensagens[i].type === "message") {
      principal.innerHTML += `
        <div class="mensagem" data-test="message">
          <span class="time-style">${tempo}</span>
          <span class="name-style"> ${sender} </span> para 
          <span class="name-style">${receiver}:</span> 
            ${texto} 
        </div>
    `;
    } else if (
      mensagens[i].type === "private_message" &&
      (mensagens[i].from === activeUser || mensagens[i].to === activeUser)
    ) {
      principal.innerHTML += `
        <div class="mensagem-privada" data-test="message">
          <span class="time-style">${tempo}</span>
          <span class="name-style"> ${sender}</span>: para 
          <span class="name-style"> ${receiver}:</span>
            ${texto}
        </div>
    `;
    }
  }
}

function enviarMensagem() {
  let mensagemEnviar = document.querySelector("input").value;
  axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
      from: activeUser,
      to: "Todos",
      text: mensagemEnviar,
      type: "message",
    })
    .then((response) => {
      pegarMensagensNoServidor();
      console.log(response.data);
      mensagemEnviar.value = "";
    })
    .catch((error) => {
      window.location.reload();
    });
}
