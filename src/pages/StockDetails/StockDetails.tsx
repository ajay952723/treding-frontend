import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, BookmarkIcon, DotIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreadingForm from "./TreadingForm";
import StockChart from "../Home/StockChart";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { useParams } from "react-router-dom";
import { fetchCoinDetails, fetchMarketChart } from "@/State/coin/coinSlice";
import {
  addCoinToWatchlist,
  fetchUserWatchlist,
} from "@/State/watchlist/watchListSlice";
import { toast } from "react-toastify";

const StockDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const coinState = useAppSelector((state) => state.coin);
  const details = coinState.details;
  const watchlistState = useAppSelector((state) => state.watchlist.watchlist);

  const [activeLabel, setActiveLabel] = useState("1 Day");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const timeSeries = [
    { label: "1 Day", value: 1 },
    { label: "1 Week", value: 7 },
    { label: "1 Month", value: 30 },
    { label: "1 Year", value: 365 },
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id));
      dispatch(fetchUserWatchlist());
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const days = timeSeries.find((t) => t.label === activeLabel)?.value || 1;
      dispatch(fetchMarketChart({ coinId: id, days }));
    }
  }, [dispatch, id, activeLabel]);

  useEffect(() => {
    if (id && watchlistState) {
      const exists = watchlistState.coins.some((coin) => coin.id === id);
      setIsBookmarked(exists);
    }
  }, [watchlistState, id]);

  const handleBookmarkClick = async () => {
    if (!id || isBookmarked) return;

    try {
      await dispatch(addCoinToWatchlist(id)).unwrap();
      toast.success("Coin added to watchlist!");
      setIsBookmarked(true);
    } catch (err: any) {
      toast.error(err || "Failed to add coin to watchlist.");
    }
  };

  if (!details || !details.market_data) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  const {
    symbol,
    name,
    image,
    market_data: {
      current_price,
      price_change_percentage_24h,
      market_cap_change_24h,
    },
  } = details;

  const priceChangeColor =
    price_change_percentage_24h < 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between items-center">
        {/* Left: Coin Info */}
        <div className="flex gap-5 items-center">
          <Avatar>
            <AvatarImage src={image?.small || ""} alt={name} />
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{symbol.toUpperCase()}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-500">{name}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">
                ${current_price.usd.toLocaleString()}
              </p>
              <p className={`text-sm ${priceChangeColor}`}>
                <span>
                  {market_cap_change_24h.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="ml-1">
                  ({price_change_percentage_24h.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon" onClick={handleBookmarkClick}>
            {isBookmarked ? (
              <BookmarkCheck className="h-6 w-6 text-green-600" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Tread</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How Much Do you want to spend?</DialogTitle>
              </DialogHeader>
              <TreadingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-14">
        <StockChart />
      </div>
    </div>
  );
};

export default StockDetails;
