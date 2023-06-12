import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";

const name = document.getElementById("name");
const address = document.getElementById("address");
const neighborhood = document.getElementById("neighborhood");
const additional = document.getElementById("additional");
const number = document.getElementById("number");

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
          nome: name,
          rua: address,
          bairro: neighborhood,
          complemento: additional,
          numero: number,
        },
      ])
      .eq("id", window.location.search.split("=")[1]);
    Swal.fire("Tudo Certo!", "Cliente atualizado com sucesso.", "success");
  }
}
