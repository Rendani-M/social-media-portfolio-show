import { pool } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = $1";

  pool.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data.rows[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET username = $1, email = $2, name = $3, city = $4, website = $5, profilePic = $6, coverPic = $7 WHERE id = $8";

    pool.query(
      q,
      [
        req.body.username,
        req.body.email,
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.rowCount > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
