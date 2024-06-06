import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {displayProps, formatPrice} from "@/lib/helpers";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic bordered">
        <thead>
          <tr>
            <th>Data i godzina</th>
            <th>Zapłacone</th>
            <th>Odbiorca</th>
            <th>Produkty</th>
          </tr>
        </thead>
        <tbody>
        {isLoading && (
          <tr>
            <td colSpan={4}>
              <div className="py-4">
                <Spinner fullWidth={true} />
              </div>
            </td>
          </tr>
        )}
        {orders.length > 0 && orders.map(order => (
          <tr key={order._id}>
            <td className="text-center">
              {(new Date(order.createdAt)).toLocaleString('pl-PL')}
            </td>
            <td className={'text-center'}>
              <p className={'text-xl ' + (order.paid ? 'text-green-600' : 'text-red-600')}>
                {order.paid ? 'PAID' : 'NOT PAID'}
              </p>
              <p className="text-gray-600">
                {formatPrice(order.tpayTransaction.amount)}
              </p>
            </td>
            <td className="">
              Dostawa: {order.selectedDeliveryOption || '?'}
              {order.selectedParcelLocker && (
                <div>
                  Paczkomat: {order.selectedParcelLocker.name}, {order.selectedParcelLocker.address.line1}, {order.selectedParcelLocker.address.line2}
                </div>
              )}
              <div className="text-sm text-gray-500">
                {order.name} {order.email}<br />
                {order.city} {order.postalCode} {order.country}<br />
                {order.streetAddress}<br />
              </div>
            </td>
            <td>
              <div className="flex flex-col gap-2">
                {order.cartProducts.map((cp,k) => (
                  <div key={k}>
                    <span>1x </span>
                    {cp.title}
                    {cp.props && <p className="text-gray-400 text-sm mb-0 -mt-1"> {displayProps(cp.props)}</p>}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
}