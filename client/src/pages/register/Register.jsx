import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { makeRequest } from "../../axios";
import { Box, Button, Typography } from "@mui/material";

const Register = () => { 
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await makeRequest.post("auth/register", inputs);
      navigate("/login")
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log("inputs", inputs)

  return (
    <Box className="register">
      <Box className="card" sx={{ width:{sm:'70%'} }}>
        <Box className="left">
          <Typography variant="h1" component="h2">
            Rendi Social
          </Typography>
          <Typography variant="p" component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </Typography>
          <Typography variant="span" component="h2">
            Do you have an account?
          </Typography>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </Box>
        <Box className="right">
          <Typography variant="h3" component="h4">
            Register
          </Typography>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && typeof err === 'object' ? JSON.stringify(err) : err}
            <Button onClick={handleClick}>Register</Button>
          </form>
          <Box sx={{ display:{xs:'block', sm:'block', md:'none'} }}>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
