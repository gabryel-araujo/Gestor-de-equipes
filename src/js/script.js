import Swal from "sweetalert2";

const saveButton = document.getElementById("save");
const localStorageKeys = Object.keys(localStorage);
const newArray = localStorageKeys.map((key) => {
  return JSON.parse(localStorage.getItem(key));
});
const divClients = document.getElementById("divClient");

window.createClient = createClient;
window.mostrarNome = mostrarNome;

//Cadastro via localStorage
function createClient() {
  const name = document.getElementById("name");
  const address = document.getElementById("address");
  const neighborhood = document.getElementById("neighborhood");
  const additional = document.getElementById("additional");
  const number = document.getElementById("number");

  // geração de id para cada cliente
  const id = new Date().getTime();
  localStorage.setItem(
    id,
    JSON.stringify({
      name: name.value,
      address: address.value,
      neighborhood: neighborhood.value,
      additional: additional.value,
      number: number.value,
      id: id,
    })
  );
  Swal.fire("Tudo Certo!", "Cliente cadastrado com sucesso.", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  newArray.map((key) => {
    divClients.innerHTML += `<div class="bg-white shadow-md rounded-lg p-4 mb-4 hover:cursor-pointer" onclick="mostrarNome('${key.id}')">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-700">${key.name}</h3>
      <p class="text-md font-semibold text-gray-700">${key.neighborhood}</p>
    </div>
    <div class="mt-4">
      <p class="text-sm text-gray-500">
        <span class="font-bold">Endereço: </span> ${key.address}
      </p>
      <p class="text-sm text-gray-500">
        <span class="font-bold">Número: </span> ${key.number}
      </p>
      <p class="text-sm text-gray-500">
        <span class="font-bold">Complemento:</span> ${key.additional}
      </p>
      
    </div>
  </div>`;
  });
});

function mostrarNome(idCliente) {
  for (let client of newArray) {
    if (client.id == idCliente) {
      const nomeCliente = encodeURIComponent(client.name);
      window.location.href = `/src/html/relatorioCliente.html?nome=${nomeCliente}`;
    }
  }
}
