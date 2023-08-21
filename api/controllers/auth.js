import { pool } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import CryptoJS from "crypto-js";

let refreshTokens = [];

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = $1";

  pool.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.rows.length) return res.status(409).json("User already exists!");

    const key = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const ciphertext = CryptoJS.AES.encrypt(req.body.password, key).toString();

    const q =
      "INSERT INTO users (username, email, password, name, coverPic, profilePic, city, website, key, isOnline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";

    const values = [
      req.body.username,
      req.body.email,
      ciphertext,
      req.body.name,
      '',
      '',
      '',
      '',
      key,
      false
    ];

    pool.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = $1";

  pool.query(q, [req.body.username], (err, userData) => {
    if (err) return res.status(500).json(err);
    if (userData.rows.length === 0) return res.status(404).json("User not found!");

    const bytes = CryptoJS.AES.decrypt(userData.rows[0].password, userData.rows[0].key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    const checkPassword = originalText === req.body.password;

    if (!checkPassword)
      return res.status(400).json("Wrong password!");

    const { password, ...others } = userData.rows[0];
    const updateQuery = "UPDATE users SET isOnline = $1 WHERE id = $2 RETURNING *, isOnline";

    pool.query(updateQuery, [true, userData.rows[0].id], (err, updateData) => {
      if (err) return res.status(500).json(err);
      if (updateData.rows.length === 0) return res.status(500).json("Failed to update user");

      const updatedUser = updateData.rows[0];
      const accessToken = generateAccessToken(updatedUser);
      const refreshToken = generateRefreshToken(updatedUser);
      refreshTokens.push(refreshToken);

      // Set the access token in the response header
      res.setHeader('authorization', accessToken);

      res.status(200).json({
        updatedUser,
        accessToken,
        refreshToken
      }); 
    });
  });
};


export const logout = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }
  
  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
  });
  
  const updateQuery = "UPDATE users SET isOnline = $1 WHERE id = $2";

  pool.query(updateQuery, [false, req.body.userId], (err, updateData) => {
    if (err) return res.status(500).json(err);

    res.status(200).json("You logged out successfully.");
  });
};


export const refreshToken = (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, "secretkey");
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, "myRefreshSecretKey");
};
