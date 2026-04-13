import app from "./app.js";
import companyRouter from "./routes/company.routes.js";

const PORT = 8080;
app.use("/companies", companyRouter);

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});
