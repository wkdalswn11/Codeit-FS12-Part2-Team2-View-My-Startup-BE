import app from "./app.js";
import companyRouter from "./routes/company.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";

const PORT = 8080;
app.use("/companies", companyRouter);
app.use("/favorite", favoriteRouter);

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});
