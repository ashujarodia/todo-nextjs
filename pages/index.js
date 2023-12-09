import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete, MdDeleteForever, MdNoteAdd, MdNoteAlt } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import { useAuth } from '@/firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { FcDeleteRow } from 'react-icons/fc';
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Home() {
	const [todoInput, setTodoInput] = useState('');
	const [todos, setTodos] = useState([]);

	const { authUser, isLoading, signOut } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !authUser) {
			router.push('/login');
		}
		if (!!authUser) {
			fetchTodos(authUser.uid);
		}
	}, [authUser, isLoading]);

	const addTodo = async () => {
		if (todoInput.trim().length === 0) {
			return;
		}
		try {
			const docRef = await addDoc(collection(db, 'todos'), {
				owner: authUser.uid,
				content: todoInput,
				completed: false,
			});
			console.log(docRef.id);
			fetchTodos(authUser.uid);
			setTodoInput('');
		} catch (error) {
			console.error(error);
		}
	};

	const deleteTodo = async (docId) => {
		try {
			await deleteDoc(doc(db, 'todos', docId));
			fetchTodos(authUser.uid);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchTodos = async (uid) => {
		try {
			const q = query(collection(db, 'todos'), where('owner', '==', uid));

			const querySnapshot = await getDocs(q);
			let data = [];
			querySnapshot.forEach((doc) => {
				console.log(doc.id, ' => ', doc.data());
				data.push({ ...doc.data(), id: doc.id });
			});

			setTodos(data);
		} catch (error) {
			console.error(error);
		}
	};

	const markAsCompletedHandler = async (event, docId) => {
		try {
			const docRef = doc(db, 'todos', docId);
			await updateDoc(docRef, {
				completed: event.target.checked,
			});
			fetchTodos(authUser.uid);
		} catch (error) {
			console.error(error);
		}
	};

	const onKeyUp = (event) => {
		if (event.key === 'Enter' && todoInput.length > 0) {
			addTodo();
		}
	};

	return !authUser ? (
		<Loader />
	) : (
		<main className=''>
			<div
				className='border border-red-400 rounded-full text-gray-500 px-4 py-1  hover:bg-gray-100  flex items-center justify-center gap-2  fixed bottom-8 left-3 z-10 cursor-pointer font-semibold'
				onClick={signOut}
			>
				<GoSignOut size={18} />
				<span>Sign out</span>
			</div>
			<div className='max-w-3xl mx-auto mt-10 p-8'>
				<div className='bg-white -m-6 p-3 sticky top-0'>
					<div className='flex justify-center items-center gap-2'>
						<MdNoteAlt
							color='red'
							size={34}
						/>
						<h1 className='text-2xl font-extrabold opacity-70'>Hello , {authUser?.username}</h1>
					</div>
					<div className='flex items-center gap-2 mt-10'>
						<input
							placeholder=' ✏️ Write Your Todo here . . .'
							type='text'
							className='font-semibold placeholder:text-gray-400 border h-14 grow shadow-sm px-4  text-lg transition-all duration-300'
							autoFocus
							value={todoInput}
							onChange={(e) => setTodoInput(e.target.value)}
							onKeyUp={onKeyUp}
						/>
						<button
							className='h-14 px-3 bg-red-500 text-white font-semibold flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-red-600'
							onClick={addTodo}
						>
							Add
						</button>
					</div>
				</div>
				<div className='my-10'>
					{todos.length > 0 ? (
						todos.map((todo) => (
							<div
								key={todo.id}
								className='flex items-center justify-between mt-4 px-2 py-1'
							>
								<input
									id={`todo-${todo.id}`}
									type='checkbox'
									checked={todo.completed}
									onChange={(e) => markAsCompletedHandler(e, todo.id)}
								/>
								<label
									className='flex items-center h-10 px-2 rounded cursor-pointer '
									htmlFor={`todo-${todo.id}`}
								>
									<span className={`ml-4 text-lg ${todo.completed ? 'line-through' : ''}`}>{todo.content}</span>
								</label>
								<div className='flex items-center gap-3'>
									<MdDelete
										size={24}
										className='text-red-400 hover:text-red-600 cursor-pointer'
										onClick={() => deleteTodo(todo.id)}
									/>
								</div>
							</div>
						))
					) : (
						<div className='text-center opacity-50 font-semibold'>You don't have any todos</div>
					)}
				</div>
			</div>
		</main>
	);
}
