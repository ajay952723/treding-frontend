import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { placeOrder } from '@/State/order/orderSlice';
import { fetchUserWallet } from '@/State/wallet/walletSlice';
import { fetchAssetByCoinAndUser } from '@/State/Asset/assetSlice';

const TreadingForm = () => {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('SELL');
  const [amountStr, setAmountStr] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const details = useAppSelector((state) => state.coin.details);
  const wallet = useAppSelector((state) => state.wallet.wallet);
  const selectedAsset = useAppSelector((state) => state.assets.selectedAsset);

  useEffect(() => {
    const jwt = localStorage.getItem('user_jwt');
    if (jwt) {
      dispatch(fetchUserWallet());
    }
  }, [dispatch]);

  useEffect(() => {
    const jwt = localStorage.getItem("user_jwt");
    if (jwt && details?.id) {
      dispatch(fetchAssetByCoinAndUser({ jwt, coinId: details.id }));
    }
  }, [details?.id, dispatch]);

  if (!details || !details.market_data) {
    return <div className="text-white p-4 text-center">Loading coin info...</div>;
  }

  const {
    id,
    name,
    symbol,
    image,
    market_data: { current_price, price_change_percentage_24h, market_cap_change_24h },
  } = details;

  const priceColor = price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500';
  const amount = parseFloat(amountStr) || 0;
  const quantity = amount && current_price.usd ? amount / current_price.usd : 0;

  const handleSubmit = async () => {
    if (quantity <= 0) {
      toast.warn('Please enter a valid amount');
      return;
    }

    const jwt = localStorage.getItem('user_jwt');
    if (!jwt) {
      toast.error('User not logged in');
      return;
    }

    if (orderType === 'SELL' && (!selectedAsset || selectedAsset.quantity < quantity)) {
      toast.error(
        `You don't have enough ${symbol.toUpperCase()} to sell. You own ${selectedAsset?.quantity?.toFixed(6) || 0}`
      );
      return;
    }

    const request = {
      coinId: id,
      quantity: parseFloat(quantity.toFixed(6)),
      orderType,
    };

    setLoading(true);
    try {
      await dispatch(placeOrder({ jwt, request })).unwrap();
      await dispatch(fetchUserWallet());
      await dispatch(fetchAssetByCoinAndUser({ jwt, coinId: details.id }));
      toast.success(
        `Successfully ${orderType === 'BUY' ? 'bought' : 'sold'} ${quantity.toFixed(6)} ${symbol.toUpperCase()}`
      );
      setAmountStr('0');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] bg-[#0e1525] text-white rounded-xl p-6 space-y-6 mx-auto shadow-lg">
      <h2 className="text-lg font-semibold text-center">How much do you want to spend?</h2>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Enter amount..."
          type="number"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          className="flex-1 h-12 bg-[#1b2334] text-white placeholder:text-gray-400 border border-gray-700 px-4 rounded-md"
        />
        <div className="w-24 h-12 flex justify-center items-center text-sm font-medium border border-gray-700 bg-[#1b2334] rounded-md">
          {quantity.toFixed(6)}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage src={image?.small} alt={name} />
        </Avatar>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{symbol.toUpperCase()}</span>
            <DotIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{name}</span>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-lg font-bold text-white">${current_price.usd.toLocaleString()}</span>
            <span className={`text-xs ${priceColor}`}>
              {market_cap_change_24h.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} ({price_change_percentage_24h.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-300">
        <span>Order Type</span>
        <span>Market Order</span>
      </div>

      <div className="flex justify-between text-sm text-gray-300">
        <span>{orderType === 'BUY' ? 'Available Cash' : 'Available Quantity'}</span>
        <span>
          {wallet
            ? orderType === 'BUY'
              ? `$${wallet.balance.toLocaleString()}`
              : `${selectedAsset?.quantity?.toFixed(6) || 0} ${symbol.toUpperCase()}`
            : 'Loading...'}
        </span>
      </div>

      <div>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full py-3 text-white text-lg font-semibold rounded-md ${
            orderType === 'SELL' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Placing...' : orderType}
        </Button>
        <Button
          variant="link"
          className="w-full mt-3 text-white underline text-sm"
          onClick={() => setOrderType(orderType === 'BUY' ? 'SELL' : 'BUY')}
        >
          {orderType === 'BUY' ? 'Or Sell' : 'Or Buy'}
        </Button>
      </div>
    </div>
  );
};

export default TreadingForm;
