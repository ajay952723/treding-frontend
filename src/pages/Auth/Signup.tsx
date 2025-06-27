import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/State/Store';
import { register as registerUser } from '@/State/Auth/AuthSlice';
import { useNavigate } from 'react-router-dom';



const schema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Signup = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {

    dispatch(registerUser({data,navigate}));

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full px-8">
      <div>
        <Label htmlFor="fullName" className="text-white">Full Name</Label>
        <Input id="fullName" {...register('fullName')} placeholder="John Doe" />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input id="email" {...register('email')} placeholder="you@example.com" />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password" className="text-white">Password</Label>
        <Input id="password" type="password" {...register('password')} placeholder="••••••••" />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        className="mt-2 bg-white text-black hover:bg-gray-200 rounded px-4 py-2 transition-all duration-200"
      >
        Sign Up
      </Button>
    </form>
  );
};

export default Signup;
