import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Notification {
	get = (id) => {
		return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/notification`, {
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

	get_setting = () => {
		return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/notification/setting`, {
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

	getListByOption = (sort_column, sort_order, count, page, searchTitle, searchUpdatedAt) => {
		return axios
			.post(`${process.env.REACT_APP_BACKEND_URL}/notification/getListByOption`, {
				sort_column: sort_column,
				sort_order: sort_order,
				count: count,
				page: page,
				searchTitle: searchTitle,
				searchUpdatedAt: searchUpdatedAt != null ? searchUpdatedAt.toString().split('T')[0] : '',
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

	update_status = (id) => {
		return axios
			.put(`${process.env.REACT_APP_BACKEND_URL}/notification`, {
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

	update_setting = (setting) => {
		return axios
			.put(`${process.env.REACT_APP_BACKEND_URL}/notification/setting`, {
				setting: setting
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
			.delete(`${process.env.REACT_APP_BACKEND_URL}/notification`, {
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
export default new Notification();