console.log("Inicio antes de configurar express");

import express from "express";
console.log("Express importado");

import cors from "cors";
console.log("Cors importado");

import routes from "./routes";
console.log("Routes importados");

const app = express();
console.log("Express app creada");

const PORT = process.env.PORT || 4000;
console.log("Puerto configurado:", PORT);

app.use(cors());
console.log("Cors configurado");

app.use(express.json());
console.log("Parser JSON configurado");

app.use("/api/payments", routes);
console.log("Rutas añadidas");

app.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});
