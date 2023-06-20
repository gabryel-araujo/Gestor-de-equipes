import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";

const name = document.getElementById("name");
const address = document.getElementById("address");
const neighborhood = document.getElementById("neighborhood");
const additional = document.getElementById("additional");
const number = document.getElementById("number");
const deleteClient = document.getElementById("deleteClient");
var nomeCliente = "";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbGpvd2J5Ynhqa3Fvb2ZzdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxNDMwNTksImV4cCI6MjAwMTcxOTA1OX0.97CaBk5mBIg4z13aFLJ0SmkqjJcLby-KYKnTf45S5cA";
const SUPABASE_URL = "https://deljowbybxjkqoofsvfk.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

var clientPromise = new Promise(async function (resolve, reject) {
  let { data: cliente, error } = await supabase.from("cliente").select("*");
  resolve(cliente);
});

clientPromise.then(function (result) {
  result.map((key) => {
    key.id.toString() === window.location.search.split("=")[1]
      ? ((name.value = key.nome),
        (address.value = key.rua),
        (neighborhood.value = key.bairro),
        (additional.value = key.complemento),
        (number.value = key.numero))
      : null;
  });
});

clientPromise.then(function (result) {
  result.map((key) => {
    key.id.toString() === window.location.search.split("=")[1]
      ? ((nomeCliente = key.nome), console.log(nomeCliente))
      : null;
  });
});

//Deletar cliente

function deleteClientData() {
  Swal.fire({
    title: "Deseja deletar?",
    text: `Após a confirmação o cliente ${nomeCliente.toUpperCase()} será apagado`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, deletar!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from("cliente")
        .delete()
        .eq("nome", `${nomeCliente}`);

      Swal.fire(
        "Deletado!",
        "Este cliente foi removido da base de dados ",
        "success"
      );
      setTimeout(() => {
        window.location.href = "clientList.html";
      }, 1500);
    }
  });
}

deleteClient.addEventListener("click", deleteClientData);

window.validateUser = validateUser;

async function validateUser() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const neighborhood = document.getElementById("neighborhood").value;
  const additional = document.getElementById("additional").value;
  const number = document.getElementById("number").value;

  name === "" &&
  address === "" &&
  neighborhood === "" &&
  additional === "" &&
  number === ""
    ? Swal.fire("Erro!", "Preencha todos os campos.", "error")
    : regUser();

  async function regUser() {
    const { data, error } = await supabase
      .from("cliente")
      .update([
        {
          nome: name.toUpperCase(),
          rua: address.toUpperCase(),
          bairro: neighborhood.toUpperCase(),
          complemento: additional.toUpperCase(),
          numero: number,
        },
      ])
      .eq("id", window.location.search.split("=")[1]);
    Swal.fire("Tudo Certo!", "Cliente atualizado com sucesso.", "success");
  }
}
