import { pool } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = $1 ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = $1 OR p.userId = $2
        ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    try {
      pool.query(q, values, (err, data) => {
        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json("Internal Server Error");
        }
        return res.status(200).json(data.rows);
      });
    } catch (error) {
      console.error("Error executing database query:", error);
      return res.status(500).json("Internal Server Error");
    }
  });
};


export const addPost = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = 'INSERT INTO posts("desc", img, userId, createdAt) VALUES ($1, $2, $3, $4)';
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    pool.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};


export const deletePost = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE id = $1 AND userId = $2";

    pool.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.rowCount > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
