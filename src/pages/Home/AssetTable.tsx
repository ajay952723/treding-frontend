import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { type CoinMarketData } from '@/State/coin/coinSlice';

interface AssetTableProps {
  coin: CoinMarketData[];
  category: string;
  onCoinClick?: (coinId: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ coin, category, onCoinClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Coin</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>High 24h</TableHead>
          <TableHead>Low 24h</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coin.map((item) => (
          <TableRow
            key={item.id}
            onClick={() => onCoinClick?.(item.id)}
            className="cursor-pointer"
          >
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={item.image} />
              </Avatar>
              <span>{item.name}</span>
            </TableCell>
            <TableCell>{item.symbol.toUpperCase()}</TableCell>
            <TableCell>{item.total_volume}</TableCell>
            <TableCell>{item.market_cap}</TableCell>
            <TableCell>{item.high_24h}</TableCell>
            <TableCell>{item.low_24h}</TableCell>
            <TableCell className="text-right">{item.current_price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssetTable;
