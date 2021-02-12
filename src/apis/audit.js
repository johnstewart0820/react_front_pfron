import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';


class Audit {
  getInfo = () => {
      return axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/audit/info`, {
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

	get = (id) => {
		return axios
		.get(`${process.env.REACT_APP_BACKEND_URL}/audit`, {
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
	
	getListByOption = (sort_column, sort_order, count, page, searchId, searchUserName, searchRole, searchDate, searchEvent) => {
		return axios
		.post(`${process.env.REACT_APP_BACKEND_URL}/audit/getListByOption`, {
			sort_column: sort_column,
      sort_order:  sort_order,
      
			count: count,
      page:  page,
      
      searchId:       searchId,
      searchUserName: searchUserName,
      searchRole:     searchRole,
      searchDate:     searchDate ? searchDate.toFormat('yyyy-MM-dd') : null,
      searchEvent:    searchEvent,
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
		.delete(`${process.env.REACT_APP_BACKEND_URL}/audit`, {
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
export default new Audit();
