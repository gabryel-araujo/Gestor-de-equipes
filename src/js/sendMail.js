import emailjs from "@emailjs/browser";

const testarEmail = document.querySelector("#testarEmail");

testarEmail.addEventListener("click", sendEmail);

function sendEmail() {
  emailjs.init("nFsekF5kfD-QIXzW3");
  emailjs
    .send("service_360zyo6", "template_ixynw5l", {
      to_name: "Nome do destinatário",
      from_name: "Seu nome",
      message: "Conteúdo do e-mail",
    })
    .then(
      function (response) {
        console.log("E-mail enviado com sucesso!", response);
      },
      function (error) {
        console.error("Erro ao enviar e-mail:", error);
      }
    );
}
