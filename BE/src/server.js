import app from "./app.js";
import companyRouter from "./routes/company.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";
import compareRouter from "./routes/compare.routes.js";
import selectionRouter from "./routes/selection.routes.js";

const PORT = 8080;
app.use("/companies", companyRouter);
app.use("/users/:userId/favorites", favoriteRouter);
app.use("/users/:userId/compares", compareRouter);
app.use("/users/:userId/selections", selectionRouter);

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});
