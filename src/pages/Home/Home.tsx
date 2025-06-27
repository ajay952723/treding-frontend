// Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AssetTable from './AssetTable';
import StockChart from './StockChart';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { fetchCoins, fetchTop50Coins, fetchCoinDetails, fetchMarketChart, fetchCoinById } from '@/State/coin/coinSlice';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('all');
  const [isBotRealease, setIsBotRealease] = useState(false);
  const dispatch = useAppDispatch();
  const coin = useAppSelector((state) => state.coin);

  useEffect(() => {
    dispatch(fetchCoinById('bitcoin'));
    dispatch(fetchMarketChart({ coinId: 'bitcoin', days: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (category === 'top50') dispatch(fetchTop50Coins());
    else dispatch(fetchCoins(1));
  }, [category, dispatch]);

  const handleCategory = (value: string) => setCategory(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Prompt submitted:', inputValue);
      setInputValue('');
    }
  };
  const navigate = useNavigate();

  const handleCoinClick = (coinId: string) => navigate(`/market/${coinId}`);

  return (
    <div className='relative'>
      <div className='lg:flex'>
        <div className='lg:w-[50%] lg:border-r'>
          <div className='p-3 flex items-center gap-4'>
            {['all', 'top50', 'topGainers', 'topLosers'].map((cat) => (
              <Button
                key={cat}
                onClick={() => handleCategory(cat)}
                className='rounded-full'
                variant={category === cat ? 'default' : 'outline'}
              >
                {cat.replace(/([A-Z])/g, ' $1')}
              </Button>
            ))}
          </div>
          <AssetTable
            coin={category === 'all' ? coin.coins : category === 'top50' ? coin.topCoins ?? [] : []}
            category={category}
            onCoinClick={handleCoinClick}
          />
        </div>
        <div className='hidden lg:block lg:w-[50%] p-5'>
          <StockChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
