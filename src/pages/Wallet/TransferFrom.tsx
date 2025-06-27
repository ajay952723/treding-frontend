import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { transferToWallet } from "@/State/wallet/walletSlice"; // ✅ Import the thunk
import { toast } from "react-toastify"; // Optional: for feedback

const TransferForm = () => {
  const { wallet } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { amount, walletId } = formData;

    if (!amount || !walletId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const resultAction = await dispatch(
        transferToWallet({
          walletId: parseInt(walletId),
          amount: parseFloat(amount),
        })
      );

      if (transferToWallet.fulfilled.match(resultAction)) {
        toast.success("Transfer successful!");
      } else {
        toast.error("Transfer failed: " + (resultAction.payload || "Unknown error"));
      }
    } catch (err) {
      toast.error("Unexpected error occurred during transfer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-10 space-y-5">
      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block mb-1 text-sm font-medium">
          Enter Amount
        </label>
        <Input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="py-7"
          placeholder="$9999"
          type="number"
        />
      </div>

      {/* Wallet ID */}
      <div>
        <label htmlFor="walletId" className="block mb-1 text-sm font-medium">
          Wallet ID
        </label>
        <Input
          name="walletId"
          value={formData.walletId}
          onChange={handleChange}
          className="py-7"
          placeholder="#ADER486"
        />
      </div>

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block mb-1 text-sm font-medium">
          Purpose
        </label>
        <Input
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="py-7"
          placeholder="Gift"
        />
      </div>

      {/* Submit Button */}
      <DialogClose className="w-full">
        <Button type="submit" className="w-full py-7 text-base">
          Submit
        </Button>
      </DialogClose>
    </form>
  );
};

export default TransferForm;
