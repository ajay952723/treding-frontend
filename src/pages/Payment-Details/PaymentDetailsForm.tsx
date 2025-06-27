import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { addPaymentDetails } from "@/State/payment/paymentDetailsSlice";

// Yup Validation Schema
const schema = Yup.object().shape({
  accountHolderName: Yup.string().required("Account holder name is required"),
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
    .required("IFSC code is required"),
  accountNumber: Yup.string()
    .matches(/^[0-9]{9,18}$/, "Account number must be 9-18 digits")
    .required("Account number is required"),
  confirmAccountNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber")], "Account numbers do not match")
    .required("Please confirm your account number"),
  bankName: Yup.string().required("Bank name is required"),
});

const PaymentDetailsForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.paymentDetails);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      accountHolderName: "",
      ifscCode: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = async (data: any) => {
    const { accountHolderName, accountNumber, ifscCode, bankName } = data;

    try {
      await dispatch(
        addPaymentDetails({
          accountHoldername: accountHolderName, // backend expects 'accountHoldername'
          accountNumber,
          ifscCode,
          bankName,
        })
      ).unwrap();

      alert("✅ Payment details added successfully!");
      reset(); // Clear the form after success
    } catch (err) {
      alert("❌ Failed to add payment details: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 max-w-lg">
      <div>
        <Label>Account Holder Name</Label>
        <Input {...register("accountHolderName")} placeholder="Ajay Sarwade" />
        {errors.accountHolderName && (
          <p className="text-sm text-red-500">{errors.accountHolderName.message}</p>
        )}
      </div>

      <div>
        <Label>IFSC Code</Label>
        <Input {...register("ifscCode")} placeholder="YESB00004" />
        {errors.ifscCode && (
          <p className="text-sm text-red-500">{errors.ifscCode.message}</p>
        )}
      </div>

      <div>
        <Label>Account Number</Label>
        <Input {...register("accountNumber")} placeholder="1234567890" />
        {errors.accountNumber && (
          <p className="text-sm text-red-500">{errors.accountNumber.message}</p>
        )}
      </div>

      <div>
        <Label>Confirm Account Number</Label>
        <Input {...register("confirmAccountNumber")} placeholder="1234567890" />
        {errors.confirmAccountNumber && (
          <p className="text-sm text-red-500">{errors.confirmAccountNumber.message}</p>
        )}
      </div>

      <div>
        <Label>Bank Name</Label>
        <Input {...register("bankName")} placeholder="Yes Bank" />
        {errors.bankName && (
          <p className="text-sm text-red-500">{errors.bankName.message}</p>
        )}
      </div>

      {loading && <p className="text-blue-500 text-sm">Submitting...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default PaymentDetailsForm;
