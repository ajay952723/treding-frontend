import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  CopyIcon, DollarSign, RefreshCcw, ShuffleIcon,
  UploadIcon, WalletIcon, ArrowDownIcon
} from "lucide-react";

import TopUpForm from "./TopUpForm";
import WithdrawalFrom from "./WithdrawalFrom";
import TransferFrom from "./TransferFrom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { useEffect, useState } from "react";
import { fetchUserWallet, addBalanceAfterPayment } from "@/State/wallet/walletSlice";
import { fetchUserTransactions } from "@/State/transaction/transactionSlice";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const { wallet } = useAppSelector((state) => state.wallet);
  const { transactions, loading, error } = useAppSelector((state) => state.transaction);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [pendingPayment, setPendingPayment] = useState<{ orderId: number, paymentId: string } | null>(null);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    const paymentId = searchParams.get("razorpay_payment_id");
    const amount = sessionStorage.getItem("pending_payment_amount");

    if (amount) {
      setPendingAmount(parseFloat(amount));
    }

    if (orderId && paymentId) {
      setPendingPayment({ orderId: parseInt(orderId), paymentId });
      setShowConfirmationDialog(true);
    } else {
      dispatch(fetchUserWallet());
      dispatch(fetchUserTransactions());
    }
  }, [searchParams, dispatch, orderId]);

  const handleAddToWallet = () => {
    if (!pendingPayment) return;
    dispatch(addBalanceAfterPayment({
      orderId: pendingPayment.orderId,
      payment_id: pendingPayment.paymentId,
    })).then(() => {
      sessionStorage.removeItem("pending_payment_amount");
      dispatch(fetchUserWallet());
      dispatch(fetchUserTransactions());
      setShowConfirmationDialog(false);
      navigate("/wallet", { replace: true });
    });
  };

  const handleSkip = () => {
    sessionStorage.removeItem("pending_payment_amount");
    setShowConfirmationDialog(false);
    navigate("/wallet", { replace: true });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between">
              <div className="flex items-center gap-5">
                <WalletIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-sm">
                      # {wallet?.user?.id || "#A475Ed"}
                    </p>
                    <CopyIcon size={15} className="cursor-pointer hover:text-slate-300" />
                  </div>
                </div>
              </div>
              <RefreshCcw
                onClick={() => {
                  dispatch(fetchUserWallet());
                  dispatch(fetchUserTransactions());
                }}
                className="w-6 h-6 cursor-pointer hover:text-gray-400"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2" />
              <span className="text-2xl font-semibold">
                {wallet?.balance != null ? `${wallet.balance} USD` : "Loading..."}
              </span>
            </div>

            <div className="flex gap-7 mt-5">
              {/* Add Money */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 hover:text-gray-400 flex flex-col cursor-pointer items-center justify-center rounded-md shadow-md">
                    <UploadIcon />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Your Wallet</DialogTitle>
                  </DialogHeader>
                  <TopUpForm />
                </DialogContent>
              </Dialog>

              {/* Withdrawal */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 hover:text-gray-400 flex flex-col cursor-pointer items-center justify-center rounded-md shadow-md">
                    <ArrowDownIcon />
                    <span className="text-sm mt-2">Withdrawal</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <WithdrawalFrom />
                </DialogContent>
              </Dialog>

              {/* Transfer */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 hover:text-gray-400 flex flex-col cursor-pointer items-center justify-center rounded-md shadow-md">
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer to Other Wallet
                    </DialogTitle>
                  </DialogHeader>
                  <TransferFrom />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <div className="py-10">
          <div className="flex items-center gap-2 pb-5">
            <h1 className="text-lg font-semibold">History</h1>
            <RefreshCcw
              onClick={() => {
                dispatch(fetchUserWallet());
                dispatch(fetchUserTransactions());
              }}
              className="h-6 w-6 cursor-pointer hover:text-gray-400"
            />
          </div>

          <div className="space-y-5">
            {loading ? (
              <p className="text-gray-500">Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-400">No transactions yet.</p>
            ) : (
              transactions.map((tx) => (
                <Card key={tx.id} className="p-2 px-5 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <Avatar>
                      <AvatarFallback>
                        {tx.type === "ADD_MONEY" ? <UploadIcon /> :
                          tx.type === "WITHDRAWAL" ? <ArrowDownIcon /> :
                            <ShuffleIcon />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h1 className="text-base font-medium capitalize">
                        {tx.type.replace(/_/g, " ").toLowerCase()}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className={`text-lg ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {tx.amount > 0 ? `+${tx.amount} USD` : `${tx.amount} USD`}
                  </p>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
          </DialogHeader>
          <p>
            Do you want to add {pendingAmount ? <span className="font-semibold">${pendingAmount}</span> : "this amount"} to your wallet?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={handleSkip} variant="ghost">No</Button>
            <Button onClick={handleAddToWallet}>Yes, Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
