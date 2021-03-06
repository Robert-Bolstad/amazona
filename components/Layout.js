import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Badge,
  Button,
  Switch,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '../utils/error';

const Layout = ({ title, description, children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarVisible, setSidebarVisable] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

  const checkMountedState = () => {
    if (!isMounted) {
      return null;
    } else {
      return (
        <>
          <Head>
            <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
            {description && (
              <meta name="description" content={description}></meta>
            )}
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" className={classes.navBar}>
              <Toolbar className={classes.toolbar}>
                <Box display="flex" alignItems="center">
                  <IconButton
                    edge="start"
                    aria-label="open drawer"
                    onClick={sidebarOpenHandler}
                  >
                    <MenuIcon className={classes.navbarButton} />
                  </IconButton>
                  <NextLink href="/" passHref>
                    <Link>
                      <Typography className={classes.brand}>amazona</Typography>
                    </Link>
                  </NextLink>
                </Box>
                <Drawer
                  anchor="left"
                  open={sidebarVisible}
                  onClose={sidebarCloseHandler}
                >
                  <List>
                    <ListItem>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>Shopping by category</Typography>
                        <IconButton
                          arial-label="close"
                          onClick={sidebarCloseHandler}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider light />
                    {categories.map((category) => (
                      <NextLink
                        key={category}
                        href={`/search?category=${category}`}
                        passHref
                      >
                        <ListItem
                          button
                          component="a"
                          onClick={sidebarCloseHandler}
                        >
                          <ListItemText primary={category}></ListItemText>
                        </ListItem>
                      </NextLink>
                    ))}
                  </List>
                </Drawer>

                <div className={classes.grow}></div>
                <div>
                  <Switch checked={darkMode} onChange={darkModeChangeHandler} />

                  <NextLink href="/cart" passHref>
                    <Link>
                      {cart.cartItems.length > 0 ? (
                        <Badge
                          color="secondary"
                          badgeContent={cart.cartItems.length}
                        >
                          Cart
                        </Badge>
                      ) : (
                        'Cart'
                      )}
                    </Link>
                  </NextLink>
                  {userInfo ? (
                    <>
                      <Button
                        className={classes.navbarButton}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={loginClickHandler}
                      >
                        {userInfo.name}
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={loginMenuCloseHandler}
                      >
                        <MenuItem
                          onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, '/order-history')
                          }
                        >
                          Order History
                        </MenuItem>
                        {userInfo.isAdmin && (
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, '/admin/dashboard')
                            }
                          >
                            Admin Dashboard
                          </MenuItem>
                        )}
                        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <NextLink href="/login" passHref>
                      <Link>Login</Link>
                    </NextLink>
                  )}
                </div>
              </Toolbar>
            </AppBar>
            <Container className={classes.main}>{children}</Container>
            <footer className={classes.footer}>
              <Typography>All rights reserved. next Amazona</Typography>
            </footer>
          </ThemeProvider>
        </>
      );
    }
  };

  const sidebarOpenHandler = () => {
    setSidebarVisable(true);
  };

  const sidebarCloseHandler = () => {
    setSidebarVisable(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };
  return <div>{checkMountedState()}</div>;
};

export default Layout;
