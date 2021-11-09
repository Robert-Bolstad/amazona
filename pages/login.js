import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      alert('succss login');
    } catch (error) {
      alert(error.response.data ? error.response.data.message : error.message);
    }
  };
  return (
    <Layout>
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'email' }}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: 'password' }}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account?&nbsp;
            <NextLink href="/register" passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
