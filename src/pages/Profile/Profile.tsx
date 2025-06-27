import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVerificationForm from "./AccountVerificationForm";
import { useAppSelector } from "@/State/Store";

const Profile = () => {
    const auth = useAppSelector((state) => state.auth);
  const isTwoStepEnabled = true;

  // ✅ This function now receives the OTP value
  const handleEnableTwoStepVerification = (otp: string) => {
    console.log("Two-step verification with OTP:", otp);
    // You can add API logic here
  };

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        {/* Profile Details */}
        <Card>
          <CardHeader className="pb-9">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem] font-medium">Email:</p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Full Name:</p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Date Of Birth:</p>
                  <p className="text-gray-500">29/01/2000</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Nationality:</p>
                  <p className="text-gray-500">Indian</p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem] font-medium">Address:</p>
                  <p className="text-gray-500">Pune</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">City:</p>
                  <p className="text-gray-500">Pune</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Pin Code:</p>
                  <p className="text-gray-500">411001</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Country:</p>
                  <p className="text-gray-500">India</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Step Verification */}
        <div className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle>Two-Step Verification</CardTitle>
                {isTwoStepEnabled ? (
                  <Badge className="bg-green-500 text-white space-x-2">
                    <VerifiedIcon size={16} />
                    <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Enable Two-Step Verification</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Your Account</DialogTitle>
                  </DialogHeader>
                  <AccountVerificationForm handleSubmit={handleEnableTwoStepVerification} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
