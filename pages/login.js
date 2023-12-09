import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '@/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase/auth';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import Link from 'next/link';
import Image from 'next/image';
import { AiFillGoogleCircle } from 'react-icons/ai';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);

	const provider = new GoogleAuthProvider();
	const router = useRouter();

	const { authUser, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && authUser) {
			router.push('/');
		}
	}, [authUser, isLoading]);

	const loginHandler = async () => {
		if (!email || !password) return;
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
			console.log(user);
		} catch (error) {
			console.error(error);
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 3000);
		}
		setEmail('');
		setPassword('');
	};

	const signInWithGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, provider);
			console.log(user);
		} catch (error) {
			console.error(error);
		}
	};

	return isLoading || (!isLoading && authUser) ? (
		<Loader />
	) : (
		<section className='h-screen'>
			<div className='h-full relative'>
				<div className='flex h-full flex-wrap items-center justify-center gap-56'>
					<div className='shrink-1 mb-12 hidden md:block'>
						<Image
							src='/bg-image.webp'
							className='w-full'
							alt='Image'
							width={600}
							height={600}
						/>
					</div>

					<div className='mb-12 flex flex-col justify-center items-center w-96 mx-4 '>
						{error && <div className='absolute top-7  border-b border-black text-red-700 my-5'>Invalid Login credentials !!</div>}
						<div className='flex flex-row items-center justify-center mb-4 border-b w-full py-4'>
							<p className='text-lg'>Sign in with -</p>
							<AiFillGoogleCircle
								size={26}
								className='mx-3'
								color='red'
								onClick={signInWithGoogle}
								cursor='pointer'
							/>
						</div>
						<p className='mb-4'>or</p>
						<form
							className='flex flex-col gap-4 w-full'
							onSubmit={(e) => e.preventDefault()}
						>
							<input
								type='email'
								className='min-h-[auto] w-full rounded border px-3 py-2 leading-[2.15]'
								placeholder='Email address'
								onChange={(e) => setEmail(e.target.value)}
								required
								value={email}
							/>

							<input
								type='password'
								className='min-h-[auto] w-full rounded border px-3 py-2 leading-[2.15]'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								required
								value={password}
							/>

							<div className='text-center lg:text-left my-4'>
								<button
									className='bg-red-500 text-white  font-semibold border w-full rounded-full py-2 hover:bg-red-600'
									type='submit'
									onClick={loginHandler}
								>
									Login
								</button>

								<p className='mb-0 mt-2 pt-1 text-sm font-semibold opacity-90'>
									Don't have an account?
									<Link
										href='/register'
										className='text-red-500 hover:text-red-600 underline ml-2'
									>
										Register
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginForm;
