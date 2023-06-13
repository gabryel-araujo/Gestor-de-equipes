import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { Modal, Ripple, initTE } from "tw-elements";
import { createClient } from "@supabase/supabase-js";
initTE({ Modal, Ripple });

var clientData;
//Referencia dados de outra página
const urlParams = new URLSearchParams(window.location.search);
const nomeCliente = urlParams.get("nome");
const searchBar = document.getElementById("searchBar");
const saveCanvas = document.getElementById("saveCanvas");
const saveButton = document.getElementById("save");
const deleteClient = document.getElementById("deleteClient");
const mobileSearch = document.getElementById("mobileSearch");
var inputFile = document.getElementById("formFile");
var imgData = [];
var signatureImg = "";
var formatedAddress = "";

window.encodeImage = encodeImage;

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbGpvd2J5Ynhqa3Fvb2ZzdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxNDMwNTksImV4cCI6MjAwMTcxOTA1OX0.97CaBk5mBIg4z13aFLJ0SmkqjJcLby-KYKnTf45S5cA";
const SUPABASE_URL = "https://deljowbybxjkqoofsvfk.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
var clientPromise = new Promise(async function (resolve, reject) {
  let { data: cliente, error } = await supabase.from("cliente").select("*");
  resolve(cliente);
  clientData = cliente;
});

//Função para buscar o endereço do cliente
async function getAddress() {
  clientPromise.then((clientData) => {
    clientData.map((client) => {
      client.nome === nomeCliente
        ? (formatedAddress = `${client.rua}, ${client.numero} | ${client.complemento} - ${client.bairro}`)
        : null;
    });
  });
}

mobileSearch.addEventListener("keyup", findClient);

async function findClient() {
  let { data: cliente, error } = await supabase
    .from("cliente")
    .select("*")
    .ilike("nome", `%${mobileSearch.value}%`);
  console.log(cliente);
}

// Exibir o nome do cliente na página
const clienteNomeElement = document.getElementById("nomeCliente");
clienteNomeElement.innerHTML = nomeCliente;

//Coletar dados do formulário ou tags que sejam necessárias
const description = document.getElementById("description");
const technician = document.getElementById("technician");

//Aqui o campo para desenvolver a função de coletar a assinatura do cliente através do canvas
window.addEventListener("load", () => {
  const signatureCanvas = document.getElementById("signature");
  const context = signatureCanvas.getContext("2d");

  let touchX = 0;
  let touchY = 0;

  let painting = false;

  function startPosition(e) {
    painting = true;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  }

  function finishedPosition() {
    painting = false;
    context.beginPath();
  }

  function handleStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = touchX - rect.left;
    const y = touchY - rect.top;
    startPosition(x, y);
  }

  function handleMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = signatureCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (!painting) return;
    draw(x, y);
  }

  function handleEnd(e) {
    e.preventDefault();
    finishedPosition();
  }

  function draw(x, y) {
    if (!painting) return;
    context.lineWidth = 5;
    context.lineCap = "round";

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  }

  signatureCanvas.addEventListener("mousedown", startPosition);
  signatureCanvas.addEventListener("mouseup", finishedPosition);
  signatureCanvas.addEventListener("mousemove", (e) => {
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  });

  signatureCanvas.addEventListener("touchstart", handleStart);
  signatureCanvas.addEventListener("touchmove", handleMove);
  signatureCanvas.addEventListener("touchend", handleEnd);

  //Função para salvar a imagem do canvas
  saveCanvas.addEventListener("click", () => {
    signatureImg = signatureCanvas.toDataURL("image/png");
    // console.log("imagem do canvas", signatureImg);
  });
});

//Função para codificar cada imagem do input em base64
function encodeImage() {
  console.log(inputFile.files.length);
  for (var i = 0; i < inputFile.files.length; i++) {
    var file = inputFile.files[i];
    var reader = new FileReader();
    reader.onload = (function (file) {
      return function (e) {
        imgData.push(e.target.result);
        console.log("Resultado", imgData);
      };
    })(file);
    reader.readAsDataURL(file);
  }
}

async function generatePDF() {
  const doc = new jsPDF();
  const urlImage = "/logo-hifi-preto-menor.png";
  //formatação e captura da data
  const data = new Date();
  const day = String(data.getDate()).padStart(2, "0");
  const month = String(data.getMonth() + 1).padStart(2, "0"); //Janeiro é 0!
  const year = String(data.getFullYear());
  const formatedData = `${day}/${month}/${year}`;

  //Aba de criação e estruturação do pdf
  //Cabeçalho do PDF
  doc.addImage(urlImage, "PNG", 10, 10, 50, 10); // x, y, width, height
  doc.setFont("helvetica", "bold");
  doc.text(`Relatório de visita técnica`, 70, 17); // x, y

  //Corpo do PDF
  doc.setFont("helvetica", "normal");
  doc.line(200, 21, 10, 21); // x1, y1, x2, y2
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`Data: `, 160, 30);
  doc.setFont("helvetica", "normal");
  doc.text(`${formatedData}`, 172, 30);
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente: `, 10, 30);
  doc.setFont("helvetica", "normal");
  doc.text(`${nomeCliente}`, 28, 30);

  doc.line(200, 35, 10, 35); // x1, y1, x2, y2
  doc.setFont("helvetica", "bold");
  doc.text(`Endereço: `, 10, 40);
  doc.setFont("helvetica", "normal");
  await getAddress();
  doc.text(formatedAddress, 34, 40);

  doc.setFont("helvetica", "bold");
  doc.text(`Técnico responsável: `, 10, 48);
  doc.setFont("helvetica", "normal");
  doc.text(`${technician.value}`, 58, 48);
  doc.line(200, 50, 10, 50);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de imagens", 10, 55);

  //Imagens adicionadas ao pdf
  encodeImage();
  for (var i = 0; i < imgData.length; i++) {
    doc.addImage(imgData[i], "PNG", 15 + i * 65, 60, 30, 45); // x, y, width, height
  }

  //Descrição da visita
  doc.setFont("helvetica", "bolditalic");
  doc.text(`Descrição da visita:`, 10, 155);
  doc.setFont("helvetica", "normal");

  const textoQuebrado = doc.splitTextToSize(description.value, 180);

  textoQuebrado.map((key, index) => {
    doc.text(key, 15, 160 + index * 5);
  });

  //Assinatura do cliente

  doc.text("Assinado por: ", 160, 275);
  doc.addImage(signatureImg, 150, 280, 60, 10);

  const pdfData = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfData);
  window.open(pdfUrl);

  //fim do pdf
}

saveButton.addEventListener("click", generatePDF);

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

// document.addEventListener("DOMContentLoaded", () => {});

deleteClient.addEventListener("click", deleteClientData);
