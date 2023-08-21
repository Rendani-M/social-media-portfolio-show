import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import { Box, Button, Typography } from "@mui/material";

const Login = () => { 
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  }); 
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      alert("Login successful!");
      window.location.href = "/";
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <Box className="login">
      <Box className="card" sx={{ width:{sm:'70%'} }}>
        <Box className="left">
          <Typography variant="h1" component="h2">
            Hello
          </Typography>
          <Typography variant="p" component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </Typography>
          <Typography variant="span" component="h2">
            Do you have an account?
          </Typography>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </Box>
        <Box className="right">
          <Typography variant="h2" component="h3">
            Login
          </Typography>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && typeof err === 'object' ? JSON.stringify(err) : err}
            <Button onClick={handleLogin}>Login</Button>
          </form>
          <Box sx={{ display:{xs:'block', sm:'block', md:'none'} }}>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;