import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class RehabitationCenter {
    get = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/rehabitation-center`, {
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/rehabitation-center/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
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

    update = (quaters, partners, rehabitationCenter, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/rehabitation-center`, {
            quaters: quaters,
            partners: partners,
            rehabitation_center: rehabitationCenter,
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

}
export default new RehabitationCenter();