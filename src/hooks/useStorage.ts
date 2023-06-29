import { useCallback } from 'react';
import { loaderTimeout } from '@Component/loader/loader';
import { getStorage } from '@Helper/storage';
import { setGuideDone } from '@Reducer/app.reducer';
import { setLoginSuccess, setLogout } from '@Reducer/auth.reducer';
import { useDispatch } from 'react-redux';

const useStorage = () => {
	const dispatch = useDispatch()

	const handleGetStorage = useCallback(() => {
		new Promise(resolve => setTimeout(resolve, loaderTimeout)).then(() => {
			getStorage('stepGuide').then((storage) => {
				if (storage === 'done') {
					dispatch(setGuideDone(true));
				} else {
					dispatch(setGuideDone(false));
				}
			});
			getStorage('isAuth').then(async (storage) => {
				if (storage === 'logged') {
					dispatch(setLoginSuccess());
				} else {
					dispatch(setLogout());
				}
			});
		});
	}, []);

	return {
		handleGetStorage
	}
}

export default useStorage
