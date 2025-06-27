import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { fetchAllAssets } from '@/State/Asset/assetSlice';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const Portfolio = () => {
  const dispatch = useAppDispatch();
  const { assets, loading, error } = useAppSelector((state) => state.assets);
  const jwt = useAppSelector((state) => state.auth.jwt);

  useEffect(() => {
    if (jwt) dispatch(fetchAllAssets(jwt));
  }, [dispatch, jwt]);

  return (
    <div className="lg:p-20 p-5">
      <h1 className="font-bold text-3xl pb-5">Portfolio</h1>

      {loading && <p>Loading assets...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && assets.length === 0 && <p>No assets found.</p>}

      {assets.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={asset.coin?.image} />
                  </Avatar>
                  <span>{asset.coin?.name || 'N/A'}</span>
                </TableCell>
                <TableCell>{asset.coin?.symbol?.toUpperCase() || 'N/A'}</TableCell>
                <TableCell>
                  {typeof asset.coin?.current_price === 'number'
                    ? asset.coin.current_price.toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{asset.quantity}</TableCell>
                <TableCell>
                  {typeof asset.buyPrice === 'number'
                    ? asset.buyPrice.toFixed(2)
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {typeof asset.quantity === 'number' && typeof asset.coin?.current_price === 'number'
                    ? (asset.quantity * asset.coin.current_price).toFixed(2)
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Portfolio;
