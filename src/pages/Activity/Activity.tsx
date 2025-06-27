import { useEffect } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { fetchAllOrders } from '@/State/order/orderSlice';

const Activity = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  const jwt = localStorage.getItem('user_jwt') || '';

  useEffect(() => {
    if (jwt) {
      dispatch(fetchAllOrders({ jwt }));
    }
  }, [dispatch, jwt]);

  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (error) return <div className="p-5 text-red-600 text-center">Error: {error}</div>;
  if (orders.length === 0) return <div className="p-5 text-center">No orders found.</div>;

  return (
    <div className='p-5 lg:px-20'>
      <h1 className='font-bold text-3xl pb-5'>Activity</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-5">Date & Time</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Profit / Loss</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const coin = order.orderItem.coin;
            const buyPrice = order.orderItem.buyprice;
            const sellPrice = order.orderItem.sellPrice;
            const quantity = order.orderItem.quantity;

            let profit = 0;
            let profitColor = '';
            let profitDisplay = 'N/A';

            if (order.orderType === 'SELL') {
              profit = (sellPrice - buyPrice) * quantity;
              profitColor = profit >= 0 ? 'text-green-600' : 'text-red-600';
              profitDisplay = `${profit >= 0 ? '+' : '-'}$${Math.abs(profit).toFixed(2)}`;
            }

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <p>{order.timestamp?.split('T')[0]}</p>
                  <p className="text-gray-400 text-sm">
                    {order.timestamp?.split('T')[1]?.split('.')[0]}
                  </p>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Avatar className='z-50'>
                    <AvatarImage src={coin.image} />
                  </Avatar>
                  <span>{coin.name}</span>
                </TableCell>
                <TableCell>${buyPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {order.orderType === 'SELL'
                    ? `$${sellPrice.toFixed(2)}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell className={profitColor}>
                  {profitDisplay}
                </TableCell>
                <TableCell className="text-right">
                  {order.orderType === 'BUY'
                    ? `$${(buyPrice * quantity).toFixed(2)}`
                    : `$${(sellPrice * quantity).toFixed(2)}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Activity;
