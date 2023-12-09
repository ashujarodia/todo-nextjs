import Loader from '@/components/Loader';
import { useAuth } from '@/firebase/auth';
import { auth } from '@/firebase/firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

const RegisterForm = () => {
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [error, setError] = useState(false);

	const { authUser, isLoading, setAuthUser } = useAuth();

	const provider = new GoogleAuthProvider();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && authUser) {
			router.push('/');
		}
	}, [authUser, isLoading]);

	const signUpHandler = async () => {
		if (!email || !username || !password) return;
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);

			await updateProfile(auth.currentUser, {
				displayName: username,
			});

			setAuthUser({
				uid: user.uid,
				email: user.email,
				username,
			});
			console.log(user);
		} catch (error) {
			console.log(error);
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 3000);
		}
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
						{error && <div className='absolute top-7  border-b border-black text-red-700 my-5'>An Error occured !!</div>}
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
								type='text'
								className='min-h-[auto] w-full rounded border px-3 py-2 leading-[2.15]'
								placeholder='Name'
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<input
								type='email'
								className='min-h-[auto] w-full rounded border px-3 py-2 leading-[2.15]'
								placeholder='Email address'
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<input
								type='password'
								className='min-h-[auto] w-full rounded border px-3 py-2 leading-[2.15]'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								required
							/>

							<div className='text-center lg:text-left my-4'>
								<button
									className='bg-red-500 text-white  font-semibold border w-full rounded-full py-2 hover:bg-red-600'
									type='submit'
									onClick={signUpHandler}
								>
									Sign Up
								</button>

								<p className='mb-0 mt-2 pt-1 text-sm font-semibold opacity-90'>
									Already have an account?
									<Link
										href='/login'
										className='text-red-500 hover:text-red-600 underline ml-2'
									>
										Login
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

export default RegisterForm;
