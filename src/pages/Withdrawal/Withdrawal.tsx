import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/State/Store";
import { fetchUserWithdrawalsHistory } from "@/State/withdrawal/withdrawalSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Withdrawal = () => {
  const dispatch = useAppDispatch();
  const { withdrawals, loading } = useAppSelector((state) => state.withdrawal);

  useEffect(() => {
    dispatch(fetchUserWithdrawalsHistory());
  }, [dispatch]);

  return (
    <div className="p-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Withdrawal</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p>{new Date(item.date).toLocaleDateString()}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(item.date).toLocaleTimeString()}
                  </p>
                </TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>${item.amount}</TableCell>
                <TableCell className="text-yellow-500">
                  {item.status || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Withdrawal;
