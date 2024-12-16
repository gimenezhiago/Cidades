const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

const bdUrl = "mongodb://127.0.0.1:27017/CidadeBrasil";

mongoose
  .connect(bdUrl, {})
  .then(() => console.log("Conexão com o MongoDB estabelecida!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definindo o modelo corretamente
const cidadeSchema = new mongoose.Schema({
  Id: Number,
  Codigo: Number,
  Nome: String,
  UF: String,
});

const Cidade = mongoose.model("CidadeBrasil", cidadeSchema, "Cidades"); 

app.get("/", (req, res) => {
  res.render("cidades", { error: null, message: null, cidades: [] });
});

app.get("/buscar", async (req, res) => {
  const query = req.query.cidade
    ? req.query.cidade.replace(/[^a-zA-Z0-9 ]/g, "")
    : "";

  if (!query) {
    return res.render("cidades", {
      error: null,
      message: "Digite o nome de uma cidade.",
      cidades: [],
    });
  }

  try {
    console.log("Query enviada:", query);

    // Buscando no banco usando o modelo Cidade
    const resultado = await Cidade.find({
      Nome: { $regex: query, $options: "i" },
    });
    console.log("Resultado da busca:", resultado);

    if (resultado.length === 0) {
      return res.render("cidades", {
        error: null,
        message: "Nenhuma cidade encontrada com esse nome.",
        cidades: [],
      });
    }

    res.render("cidades", { error: null, message: null, cidades: resultado });
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
    res.status(500).render("cidades", {
      error: "Erro no servidor ao buscar cidade.",
      message: null,
      cidades: [],
    });
  }
});

const port = 5555;
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
