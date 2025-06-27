import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { fetchPaymentDetails } from "@/State/payment/paymentDetailsSlice";


const PaymentDetails = () => {
  const dispatch = useAppDispatch();
  const { details, loading, error } = useAppSelector((state) => state.paymentDetails);

  // Fetch payment details when component mounts
  useEffect(() => {
    dispatch(fetchPaymentDetails());
  }, [dispatch]);

  return (
    <div className="px-6 md:px-20">
      <h1 className="text-2xl font-semibold py-10">Payment Details</h1>

      {/* Loading/Error Handling */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* If payment details exist, show card; else show form */}
      {details ? (
        <Card>
          <CardHeader>
            <CardTitle>{details.bankName}</CardTitle>
            <CardDescription>
              A/C No: ************{details.accountNumber.slice(-4)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex">
              <p className="w-40 font-medium">Account Holder</p>
              <p className="text-gray-500">{details.accountHoldername}</p>
            </div>
            <div className="flex">
              <p className="w-40 font-medium">IFSC Code</p>
              <p className="text-gray-500">{details.ifscCode}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Payment Details</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payment Details</DialogTitle>
              </DialogHeader>
              <PaymentDetailsForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
