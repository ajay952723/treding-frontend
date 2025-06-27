import  { useEffect } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { fetchUserWatchlist, removeCoinFromWatchlist } from '@/State/watchlist/watchListSlice';
import type { CoinMarketData } from '@/State/watchlist/watchListSlice';
import { toast } from 'react-toastify';


const Watchlist = () => {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.watchlist.watchlist);
  const loading = useAppSelector((state) => state.watchlist.loading);

  useEffect(() => {
    dispatch(fetchUserWatchlist());
  }, [dispatch]);

  const handleRemoveToWatchList = async (coin: CoinMarketData) => {
  try {
    await dispatch(removeCoinFromWatchlist(coin.id)).unwrap();
    toast.success(`${coin.name} removed from watchlist.`);
  } catch (err: any) {
    toast.error(err || "Failed to remove coin from watchlist.");
  }
};

  if (loading || !watchlist) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  return (
    <div className="lg:p-20 p-5">
      <h1 className="font-bold text-3xl pb-5">Watchlist</h1>
      {watchlist.coins.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Your watchlist is empty.</div>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">Coin</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right text-red-600">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlist.coins.map((coin: CoinMarketData, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="z-50">
                    <AvatarImage src={coin.image} />
                  </Avatar>
                  <span>{coin.name}</span>
                </TableCell>
                <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveToWatchList(coin)}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Watchlist;
