import { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { getError } from '../../utils/error';
import Layout from '../../components/Layout';
import {
  Card,
  CircularProgress,
  ListItemText,
  Button,
  Grid,
  List,
  ListItem,
  Typography,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import NextLink from 'next/link';

import useStyles from '../../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

const AdminOrders = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem component="h1" variant="h1">
                <Typography>Orders</Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id.substring(20, 24)}</TableCell>
                          <TableCell>
                            {order.user ? order.user.name : 'DELETED USER'}
                          </TableCell>
                          <TableCell>{order.createdAt}</TableCell>
                          <TableCell>{'$' + order.totalPrice}</TableCell>
                          <TableCell>
                            {order.isPaid
                              ? `paid at ${order.paidAt}`
                              : 'not Paid'}
                          </TableCell>
                          <TableCell>
                            {order.isDelivered
                              ? `delivered at ${order.deliveredAt}`
                              : 'not delivered'}
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/order/${order._id}`} passHref>
                              <Button variant="contained" color="primary">
                                Details
                              </Button>
                            </NextLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
