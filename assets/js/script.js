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
      mostrarMensagens();
    })
    .catch((error) => {
      let errorMesage = error.response.status;
      if (errorMesage === 400) {
        getUserName();
      }
      console.log(error);
    });
}

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

function mostrarMensagens() {
  //essa só está conseguindo ler as mensagens por enquanto
  axios
    .get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then((response) => {
      principal.innerHTML = "     ";
              mensagens = response.data;
      adicionarMensagemNoHTML();
    })
    .catch((error) => {
      console.log(
        "Não foi possível carregar as mensagens. Por favor recarregue a pagina"
      );
    });
}

function adicionarMensagemNoHTML() {
  console.log(mensagens);
  for (let i = 0; i < mensagens.length; i++) {
    const tempo = `(${mensagens[i].time})`;
    const sender = `${mensagens[i].from}`;
    const texto = `${mensagens[i].text}`;
    const receiver = `${mensagens[i].to}`;

    console.log(mensagens[i].type);

    if (mensagens[i].type === "status") {
      principal.innerHTML += `
        <div class="mensagem-status"><span class="time-style">${tempo}</span>
        <span class="name-style"> ${sender} </span> ${texto} 
        </div>
    `;
    } else if (mensagens[i].type === "message") {
      principal.innerHTML += `
        <div class="mensagem"><span class="time-style">${tempo}</span>
          <span class="name-style"> ${sender} </span> para <span class="name-style">${receiver}:</span> ${texto} 
        </div>
    `;
    } else if (mensagens[i].type === "private_message") {
      principal.innerHTML += `
        <div class="mensagem-privada"><span class="time-style">${tempo}</span>
          <span class="name-style"> ${sender}</span>: para <span class="name-style"> ${receiver}:</span> ${texto}
        </div>
    `;
    }
  }
}
