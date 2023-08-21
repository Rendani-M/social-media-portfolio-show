import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
// import storiesRoutes from "./routes/stories.js";
import onlineStatusRoutes from "./routes/onlinestatus.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true); //allow for cookies to be used
  next(); 
});
app.use(express.json());
app.use(
  cors({ //Only allow localhost:3000 to access this api
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
// // app.use("/api/stories", storiesRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/onlinestatus", onlineStatusRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
