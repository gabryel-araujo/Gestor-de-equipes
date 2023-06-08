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

  window.regUser = regUser;
  window.mostrarNome = mostrarNome;

  //Cadastro via localStorage
  async function regUser() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const neighborhood = document.getElementById("neighborhood").value;
    const additional = document.getElementById("additional").value;
    const number = document.getElementById("number").value;

    // localStorage.setItem(
    //   id,
    //   JSON.stringify({
    //     name: name.value,
    //     address: address.value,
    //     neighborhood: neighborhood.value,
    //     additional: additional.value,
    //     number: number.value,
    //     id: id,
    //   })
    // );

    const { data, error } = await supabase.from("cliente").insert([
      {
        nome: name,
        rua: address,
        bairro: neighborhood,
        complemento: additional,
        numero: number,
      },
    ]);

    Swal.fire("Tudo Certo!", "Cliente cadastrado com sucesso.", "success");
  }

  cliente.map((key) => {
    divClients.innerHTML += `<div class="bg-white shadow-md rounded-lg p-4 mb-4 hover:cursor-pointer" onclick="mostrarNome('${key.id}')">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-700">${key.nome}</h3>
      <p class="text-md font-semibold text-gray-700">${key.bairro}</p>
    </div>
    <div class="mt-4">
      <p class="text-sm text-gray-500">
        <span class="font-bold">Endereço: </span> ${key.rua}
      </p>
      <p class="text-sm text-gray-500">
        <span class="font-bold">Número: </span> ${key.numero}
      </p>
      <p class="text-sm text-gray-500">
        <span class="font-bold">Complemento:</span> ${key.complemento}
      </p>
      
    </div>
  </div>`;
  });

  function mostrarNome(idCliente) {
    for (let client of cliente) {
      if (client.id == idCliente) {
        const nomeCliente = encodeURIComponent(client.nome);
        window.location.href = `/src/html/relatorioCliente.html?nome=${nomeCliente}`;
      }
    }
  }
});
