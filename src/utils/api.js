class API {

    constructor() {
        if (!API.instance) {
            this.token = API.getItem('token');
            this.user = API.getItem('user', true);
            API.instance = this;
        }
        return API.instance;
    }

    static async request(path, options = {}) {
        const host = process.env.REACT_APP_SPOOFYAPI;
        return await fetch(`${host}${path}`, options);
    }

    static getItem(key, parse = false) {
        let res = localStorage.getItem(key);
        if (res && parse)
            res = JSON.parse(res);
        return res;
    }

    static setItem(key, item, parse = true) {
        if (item && parse)
            item = JSON.stringify(item);
        localStorage.setItem(key, item);
    }

    getUser() {
        if (!this.user) {
            this.user = API.getItem('user', true);
        }
        return this.user;
    }

    getToken() {
        if (!this.token) {
            this.token = API.getItem('token');
        }
        return this.token;
    }

    async login(token) {
        const options = {
            headers: {
                'access_token': token
            }
        };
        try {
            const response = await API.request('/login', options);
            if (response.status !== 200) {
                throw new Error('Request not successfull')
            }
            const body = await response.json();
            this.token = token;
            API.setItem('token', this.token, false);
            this.user = body.user;
            API.setItem('user', this.user);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    
    async getAllUsers() {
        const options = {
            headers: {
                'access_token': this.token
            }
        };
        try {
            const response = await API.request('/api/v2/all/users', options);
            if (response.status !== 200) {
                throw new Error('Request not successfull');
            }
            const body = await response.json();
            return body.users;
        } catch (error) {
            throw new Error(error);
        }
    }

    async requestTopInfo() {
        const options = {
            method: 'POST',
            headers: {
                'access_token': this.token
            }
        };
        try {
            const response = await API.request('/api/v2/me/top', options);
            if (response.status !== 200) {
                throw new Error('Request not successfull');
            }
        } catch (error) {
            throw new Error(error);
        }
    }

}

export default new API();