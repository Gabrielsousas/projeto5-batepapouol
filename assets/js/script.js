let activeUser;

getUserName();

axios
  .get("https://mock-api.driven.com.br/api/v6/uol/participants")
  .then((response) => {
    console.log(response.data);
  });

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
          console.log('Você foi desconectado. Por favor recarregue a pagina');
        });
}, 5000);

}
