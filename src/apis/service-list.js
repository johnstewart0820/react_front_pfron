import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class ServiceList {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/service-list/info`, {
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
        .get(`${process.env.REACT_APP_BACKEND_URL}/service-list`, {
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
    create = (number, name, module, type, amount_usage, unit, amount_takes, is_required, not_applicable) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/service-list`, {
            number: number,
            name: name,
            module: module,
			type: type,
            amount_usage, amount_usage,
            unit: unit,
            amount_takes: amount_takes,
            is_required: is_required,
            not_applicable: not_applicable,
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchNumber, searchName, searchModule, searchUnit) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/service-list/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchNumber: searchNumber,
            searchName: searchName,
            searchModule: searchModule,
            searchUnit: searchUnit,
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

    update = (number, name, module, type, amount_usage, unit, amount_takes, is_required, not_applicable, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/service-list`, {
            number: number,
            name: name,
            module: module,
			type: type,
            amount_usage, amount_usage,
            unit: unit,
            amount_takes: amount_takes,
            is_required: is_required,
            not_applicable: not_applicable,
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
        .delete(`${process.env.REACT_APP_BACKEND_URL}/service-list`, {
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
export default new ServiceList();