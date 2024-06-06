import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";
import axios from "axios";

async function getBearer() {
  const response = await axios.post('https://api.tpay.com/oauth/auth', {
    "client_id": process.env.TPAY_CLIENT,
    "client_secret": process.env.TPAY_SECRET,
    "scope": "read write"
  });
  return response.data.access_token;
}

async function getTransaction(tpayId, token) {
  const response = await axios.get('https://api.tpay.com/transactions/'+tpayId, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
}

export default async function handler(req,res) {
  await mongooseConnect();
  const orders = await Order.find({tpayStatusChecked:false}).sort({createdAt:-1});
  console.log('orders length '+orders.length);

  const token = await getBearer();

  for (const order of orders) {
    if (!order.tpayStatusChecked) {
      console.log('checking order '+order._id);
      const transaction = await getTransaction(order.tpayTransactionId, token);
      console.log(transaction);
      order.paid = transaction.status === 'correct';
      order.tpayStatusChecked = true;
      order.tpayTransaction = transaction;
      await order.save();
    }
  }

  res.json(await Order.find().sort({createdAt:-1}));
}