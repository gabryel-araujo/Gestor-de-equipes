import Swal from "sweetalert2";
import { createClient } from "@supabase/supabase-js";

document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbGpvd2J5Ynhqa3Fvb2ZzdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxNDMwNTksImV4cCI6MjAwMTcxOTA1OX0.97CaBk5mBIg4z13aFLJ0SmkqjJcLby-KYKnTf45S5cA";
  const SUPABASE_URL = "https://deljowbybxjkqoofsvfk.supabase.co";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let { data: cliente, error } = await supabase.from("cliente").select("*");

  const saveButton = document.getElementById("save");
  const divClients = document.getElementById("divClient");

  window.validateFields = validateFields;
  window.mostrarNome = mostrarNome;

  //Cadastro via supabase
  //Verificando campos válidos
  function validateFields() {
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
      const { data, error } = await supabase.from("cliente").insert([
        {
          nome: name.toUpperCase(),
          rua: address.toUpperCase(),
          bairro: neighborhood.toUpperCase(),
          complemento: additional.toUpperCase(),
          numero: number,
        },
      ]);
      Swal.fire("Tudo Certo!", "Cliente cadastrado com sucesso.", "success");
    }
  }

  function mostrarNome(idCliente) {
    for (let client of cliente) {
      if (client.id == idCliente) {
        const nomeCliente = encodeURIComponent(client.nome);
        window.location.href = `/src/html/relatorioCliente.html?nome=${nomeCliente}`;
      }
    }
  }
});
