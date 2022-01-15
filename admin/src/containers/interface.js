import { setMiintingSellingFee, SetAuthenticate } from './interact';
const Axios = require('axios');
const Canceler = Axios.CancelToken.source();

const api = { 
	baseUrl: window.location.origin,
	serverTime: '/server_time',
	nfts: '/nfts',
	authors: '/authors',
	admin: '/admins',
	users: '/users',
	activities: '/activities',
};

export const getTotalUser = async () => {	
  const { data } = await Axios.get(`${api.baseUrl}${api.authors}/count`, {
    cancelToken: Canceler.token,
    params: {},
  });
  return data;
}

export const getTotalNFTs = async () => {	
  const { data } = await Axios.get(`${api.baseUrl}${api.nfts}/count`, {
    cancelToken: Canceler.token,
    params: {},
  });
  return data;
}

export const getTotalBalance = async (param) => {
	const { data } = await Axios.get(`${api.baseUrl}${api.activities}/balance?type=${param}`, {
    cancelToken: Canceler.token,
    params: {},
  });
  return data;
}

export const getUserList  = async () => {
	const {data} = await Axios.get(`${api.baseUrl}${api.users}`, {
		cancelToken : Canceler.token,
		params : {}
	});
	return data;
}

export const getActivity = async (param) => {
	const {data} = await Axios.get(`${api.baseUrl}${api.activities}/monthly?type=${param}`, {
		cancelToken : Canceler.token,
		params : {}
	});
	return data;
}

export const setFees  = async (userId, authorId, wallet, selling_fee=null, minting_fee=null) => 
{
	let updatingData = {};
	if(selling_fee !== null)
	{
		updatingData = {...updatingData, "selling_fee" : selling_fee }
	}
	if(minting_fee !== null)
	{
		updatingData = {...updatingData, "minting_fee": minting_fee }
	}
	if(updatingData !== {})
	{
		console.log('[Minting Fee] = ', minting_fee);
		console.log('[Selling Fee] = ', selling_fee);
		let res;
		try {
			res = await setMiintingSellingFee (wallet, minting_fee, selling_fee);
		} catch(error) {
			return {
				success: false,
				status: error.message
			}
		}
		 
		if (res.success) {
			//update users author info
			const {data} = await Axios.put(`${api.baseUrl}${api.authors}/${authorId}`, 
			updatingData,
			{
				cancelToken : Canceler.token,
				params : {}
			});
			return {
				success: true,
				data
			};
		} else {
			console.log('[ERROR] = ', res.status);
			return res;
		}
		
	}
	return {
		success: false,
		status: ''
	}
}

export const setRole  = async (userId, wallet, authorId, role=null) => 
{
	if(role >=1 && role <= 3)
	{
		//update user info
		try {
			let updateRole = 0;
			if(role === 2) updateRole = 0;
			if(role === 1) updateRole = 1;
			if(role === 3) updateRole = 2;
			const res = await SetAuthenticate (wallet, updateRole);
			if (res.success) {
				const {data} = await Axios.put(`${api.baseUrl}${api.users}/${userId}`, 
				{"role" : role},
				{
					cancelToken : Canceler.token,
					params : {}
				});
				return {
					success: true,
					data
				};
			} else {
				console.log('[ERROR] = ', res.status);
				return res;
			}
		} catch (error) {
			console.log('[Error] = ', error);
			return {
				success: false,
				status: error.message
			}
		}
		
	}
	return {
		success: false,
		status: 'Role Error'
	}
}