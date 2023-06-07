import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { Modal, Ripple, initTE } from "tw-elements";

initTE({ Modal, Ripple });

//Referencia dados de outra página
const urlParams = new URLSearchParams(window.location.search);
const nomeCliente = urlParams.get("nome");
var inputFile = document.getElementById("formFile");
const searchBar = document.getElementById("searchBar");
const saveCanvas = document.getElementById("saveCanvas");
//referencia de dados de outra página usando o vite
var imgData = [];
var signatureImg = "";

// Exibir o nome do cliente na página
const clienteNomeElement = document.getElementById("nomeCliente");
clienteNomeElement.innerHTML = nomeCliente;
console.log("nome cliente", nomeCliente);

//Varrer o localStorage
const localStorageKeys = Object.keys(localStorage);
const newArray = localStorageKeys.map((key) => {
  return JSON.parse(localStorage.getItem(key));
});

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
    console.log("imagem do canvas", signatureImg);
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
//Função para coletar dados do cliente
let clientAddress = "";
let clientNumber = "";
let clientAdditional = "";
let clientNeighborhood = "";
console.log("newArray", newArray);
function getClientData(client) {
  newArray.map((key) => {
    key.name === client
      ? ((clientAddress = key.address),
        (clientNumber = key.number),
        (clientAdditional = key.additional),
        (clientNeighborhood = key.neighborhood))
      : null;
  });
}

function generatePDF() {
  const doc = new jsPDF();
  const urlImage = "/logo-hifi-preto-menor.png";
  //formatação e captura da data
  const data = new Date();
  const day = String(data.getDate()).padStart(2, "0");
  const month = String(data.getMonth() + 1).padStart(2, "0"); //Janeiro é 0!
  const year = String(data.getFullYear());
  const formatedData = `${day}/${month}/${year}`;

  //aba para criação de funções que serão utilizadas
  console.log(nomeCliente);

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
  getClientData(nomeCliente);
  const formatedAddress = `${clientAddress}, ${clientNumber} | ${clientAdditional} - ${clientNeighborhood}`;
  doc.setFont("helvetica", "bold");
  doc.text(`Endereço: `, 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`${formatedAddress}`, 34, 40);
  doc.setFont("helvetica", "bold");
  doc.text(`Técnico responsável: `, 10, 48);
  doc.setFont("helvetica", "normal");
  doc.text(`${technician.value}`, 58, 48);
  doc.line(200, 50, 10, 50);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de imagens", 10, 55);

  //Imagens
  // const meuInput = document.getElementById("formFile");
  // doc.addImage(imgData, "PNG", 10, 60, 50, 50); // x, y, width, height
  encodeImage();
  for (var i = 0; i < imgData.length; i++) {
    doc.addImage(imgData[i], "PNG", 15 + i * 65, 60, 60, 85); // x, y, width, height
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
}
window.generatePDF = generatePDF;
window.encodeImage = encodeImage;

searchBar.addEventListener("focus", function () {
  // Swal.fire("Voce clicou", "No botão de pesquisa", "success");
});
