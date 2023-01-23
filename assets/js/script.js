let activeUser;

let mensagens;

let mensagemStatus;
let mensagemNormal;
let mensagemPrivada;

const principal = document.querySelector("main");
principal.innerHTML = "";

getUserName();

function getUserName() {
  let userName = prompt("Qual seu nome?");
  axios
    .post("https://mock-api.driven.com.br/api/v6/uol/participants", {
      name: userName,
    })
    .then((response) => {
      console.log(response.data);
      activeUser = userName;
      verificaUserOnline();
    })
    .catch((error) => {
      let errorMesage = error.response.status;
      if (errorMesage === 400) {
        getUserName();
      }
      console.log(error);
    });
}

pegarMensagensNoServidor();
function verificaUserOnline() {
  setInterval(() => {
    axios
      .post("https://mock-api.driven.com.br/api/v6/uol/status", {
        name: activeUser,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Você foi desconectado. Por favor recarregue a pagina");
      });
  }, 5000);
}

function pegarMensagensNoServidor() {
  setInterval(() => {
    axios
      .get("https://mock-api.driven.com.br/api/v6/uol/messages")
      .then((response) => {
        mensagens = response.data;
        principal.innerHTML = "";
        adicionarMensagemNoHTML();
        const lastChild = principal.lastElementChild;
        lastChild.scrollIntoView();
      })
      .catch((error) => {
        console.log(error);
      });
  }, 3000);
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
    } else if (mensagens[i].type === "private_message" && (mensagens[i].from === activeUser || mensagens[i].to === activeUser)) {
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
  axios
    .post("https://mock-api.driven.com.br/api/v6/uol/messages", {
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
      console.log(
        "Não foi possivel enviar a mensagem por alguma magia desconhecida"
      );
    });
}
