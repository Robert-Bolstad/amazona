import nextConnect from 'next-connect';
import { isAuth } from '../../../utils/auth';
const handler = nextConnect();

handler.get(async (req, res) => {
  handler.use(isAuth);
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default handler;
