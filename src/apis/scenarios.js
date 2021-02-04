import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class User {
    getScenariosLabels = () => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/scenarios`, {
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

    getSelectionData = () => {
        return axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/scenarios/selection_data`, {
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

    createScenario = (evalue, description, year_start, year_end, selected_series_id_list) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/scenarios`, {
            eval: evalue,
            description: description,
            year_start: year_start,
            year_end: year_end,
            selected_series_id_list: selected_series_id_list
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

    getScenariosByOption = (sort_column, sort_order, count, page, search_key) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/scenarios/get_scenarios_by_option`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            search_key: search_key
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
export default new User();