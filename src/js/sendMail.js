import { createClient } from "@supabase/supabase-js";

const testarEmail = document.querySelector("#testarEmail");

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbGpvd2J5Ynhqa3Fvb2ZzdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxNDMwNTksImV4cCI6MjAwMTcxOTA1OX0.97CaBk5mBIg4z13aFLJ0SmkqjJcLby-KYKnTf45S5cA";
const SUPABASE_URL = "https://deljowbybxjkqoofsvfk.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
var clientPromise = new Promise(async function (resolve, reject) {
  let { data: cliente, error } = await supabase.from("cliente").select("*");
  resolve(cliente);
  clientData = cliente;
});

async function testar() {
  const { data } = await supabase.storage
    .from("file-bucket")
    .getPublicUrl(`pdf/arquivo.pdf`);
  console.log(data.publicUrl);
}

testarEmail.addEventListener("click", testar);
