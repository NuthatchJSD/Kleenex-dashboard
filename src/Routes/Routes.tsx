import { createBrowserRouter, redirect } from 'react-router-dom';
import { fakeAuthProvider, loginAction } from '../auth';
import { authenticatedLoader, protectedLoader } from './Loaders';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Layout from '../components/Layout';

const router = createBrowserRouter([
	{
		id: 'root',
		path: '/',
		loader() {
			// Our root route always provides the user, if logged in
			return { user: fakeAuthProvider.username };
		},
		Component: Layout,
		children: [
			{
				index: true,
				Component: PublicPage,
			},
			{
				path: 'login',
				action: loginAction,
				loader: authenticatedLoader,
				Component: Login,
			},
			{
				path: 'dashboard',
				loader: protectedLoader,
				Component: Dashboard,
			},
		],
	},
	{
		path: '/logout',
		async action() {
			// We signout in a "resource route" that we can hit from a fetcher.Form
			await fakeAuthProvider.signout();
			return redirect('/');
		},
	},
]);
function PublicPage() {
	return <h3>Public</h3>;
}

export default router;