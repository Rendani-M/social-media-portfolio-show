import { pool } from "../connect.js";
import jwt from "jsonwebtoken";

export const getOnlineFriends = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT u.id, u.name, u.profilePic FROM users AS u 
               INNER JOIN relationships AS r ON (u.id = r.followedUserId) 
               WHERE u.isOnline = true`;

    pool.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  });
};

export const getOnlineUsers = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT u.id, u.name, u.profilePic FROM users AS u`;

    pool.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  });
};

export const updateOnlineStatus = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET isOnline = $1 WHERE id = $2";

    pool.query(q, [req.body.isOnline, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User online status updated.");
    });
  });
};
