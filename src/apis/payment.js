import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Payment {
	getInfo = () => {
		return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/payment/info`, {
				headers: authHeader(storage.getStorage('token')),
			})
			.then(response => {
				if (response.data.code === 401) {
					storage.removeStorage('token');
					storage.removeStorage('role');
					return response.data;
				} else if (response.data.code === 200) {
					return response.data;
				}
			}).catch(error => {
				return error;
			})
	}

	getQuaterList = (rehabitation_center) => {
		return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/payment/quater_list`, {
				headers: authHeader(storage.getStorage('token')),
				params: {
					rehabitation_center: rehabitation_center
				}
			})
			.then(response => {
				if (response.data.code === 401) {
					storage.removeStorage('token');
					storage.removeStorage('role');
					return response.data;
				} else if (response.data.code === 200) {
					return response.data;
				}
			}).catch(error => {
				return error;
			})
	}
	get = (id) => {
		return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/payment`, {
				headers: authHeader(storage.getStorage('token')),
				params: {
					id: id
				},
			})
			.then(response => {
				if (response.data.code === 401) {
					storage.removeStorage('token');
					storage.removeStorage('role');
					return response.data;
				} else if (response.data.code === 200) {
					return response.data;
				}
			}).catch(error => {
				return error;
			})
	}
	create = (value, rehabitation_center, service, pricelist_amount, pricelist_cost, is_flatrate_service, value_list) => {
		return axios
			.post(`${process.env.REACT_APP_BACKEND_URL}/payment`, {
				value: value,
				rehabitation_center: rehabitation_center,
				service: service,
				pricelist_amount: pricelist_amount,
				pricelist_cost: pricelist_cost,
				is_flatrate_service: is_flatrate_service,
				value_list: value_list
			}, {
				headers: authHeader(storage.getStorage('token'))
			}).then(response => {
				if (response.data.code === 401)
					storage.removeStorage('token');
				return response.data;
			}).catch(error => {
				return error;
			})
	}

	getListByOption = (sort_column, sort_order, count, page, searchId, searchValue, searchRehabitationCenter, searchService) => {
		return axios
			.post(`${process.env.REACT_APP_BACKEND_URL}/payment/getListByOption`, {
				sort_column: sort_column,
				sort_order: sort_order,
				count: count,
				page: page,
				searchId: searchId,
				searchValue: searchValue,
				searchRehabitationCenter: searchRehabitationCenter,
				searchService: searchService,
			}, {
				headers: authHeader(storage.getStorage('token'))
			})
			.then(response => {
				if (response.data.code === 401)
					storage.removeStorage('token');
				return response.data;
			}).catch(error => {
				return error;
			})
	}

	update = (value, rehabitation_center, service, pricelist_amount, pricelist_cost, is_flatrate_service, value_list, id) => {
		return axios
			.put(`${process.env.REACT_APP_BACKEND_URL}/payment`, {
				value: value,
				rehabitation_center: rehabitation_center,
				service: service,
				pricelist_amount: pricelist_amount,
				pricelist_cost: pricelist_cost,
				is_flatrate_service: is_flatrate_service,
				value_list: value_list,
				id: id
			}, {
				headers: authHeader(storage.getStorage('token'))
			})
			.then(response => {
				if (response.data.code === 401)
					storage.removeStorage('token');
				return response.data;
			}).catch(error => {
				return error;
			})
	}

	delete = (id) => {
		return axios
			.delete(`${process.env.REACT_APP_BACKEND_URL}/payment`, {
				headers: authHeader(storage.getStorage('token')),
				params: {
					id: id
				},
			})
			.then(response => {
				if (response.data.code === 401)
					storage.removeStorage('token');
				return response.data;
			}).catch(error => {
				return error;
			})
	}
}
export default new Payment();