import { defineStore } from 'pinia';
import axios from 'axios';

interface CurrentUser {
    id:string;
    first_name: string;
    last_name: string;
    role: number;
    username:string;
    email:string;
    pic:string;
}

export const useAuthStore = defineStore('useAuthStore', {
    state: () => ({
        currentUser: null as CurrentUser | null,
        token: localStorage.getItem("token") || '',
        usrrl:localStorage.getItem("usrrl") || 'sdadm',
        userDtl: localStorage.getItem("userDtl") || "",
        isAuthenticated: localStorage.getItem("token") ? true: false
    }),
    actions: {
        async login(url: string, data: any) {
            try {
                const response = await axios.post(url, data);
                const { token, user } = response.data;
                this.setToken(token);
                this.setCurrentUser(user);
                this.setAuthenticated(true);
                const role = user?.role === 1? "rspadm" : user?.role === 2 ? "student":user?.role === 3 ? "dadm":"sdadm";
                this.setRole(role);
                this.setUserDtl(user.first_name + user.last_name + "_" + user.profile + "_" + user.email + "_" + user.username);
                
                if (response.status == 200 && token) {
                    return true
                }else{
                   return false
                }
            } catch (error) {
                throw new Error('Login failed. Please try again.');
            }
        },
        async register(url: string, data: any) {
            try {
                const response = await axios.post(url, data);
                if (response.status === 200) {
                   return response
                }
            } catch (error:any) {
                throw new Error(error);
            }
        },
        async getUserInfo(url: string) {
            try {
                const header = { headers : {Authorization: 'Bearer ' + this.token}}
                const response = await this.authenticatedRequest(() => axios.get(url, header));
                this.setCurrentUser(response.data);
                return response.data;
            } catch (error) {
                console.log(error);
                
                throw new Error('Failed to fetch user information.');
            }
        },
        async changeRole(url: string, data:any) {
            try {
                const header = { headers : {Authorization: 'Bearer ' + this.token}}
                const response = await this.authenticatedRequest(() => axios.post(url, data, header));
                return response.data;
            } catch (error) {
                
                throw error;
            }
        },

        async getAllUsers(url: string) {
            try {
                const header = { headers : {Authorization: 'Bearer ' + this.token}}
                const response = await this.authenticatedRequest(() => axios.get(url, header));
                return response.data;
            } catch (error) {
                throw new Error('Failed to fetch user list.');
            }
        },
        async logout() {
            try {
                this.clearToken();
                this.setCurrentUser(null);
                this.setAuthenticated(false);
                return true;
            } catch (error) {
                throw new Error('Logout failed. Please try again.');
            }
        },
        setToken(token: string) {
            this.token = token;
            localStorage.setItem('token', token);
        },
        setRole(role:string){
           this.usrrl = role;
           localStorage.setItem("usrrl", role);
        },
        setUserDtl(data:any){
           this.userDtl = data;
           localStorage.setItem("userDtl", data);
        },
        clearToken() {
            this.token = '';
            localStorage.removeItem('token');
        },
        setCurrentUser(user: CurrentUser | null) {
            this.currentUser = user;
        },
        setAuthenticated(status: boolean) {
            this.isAuthenticated = status;
        },
        async authenticatedRequest(requestFn: () => Promise<any>) {
            if (!this.token) {
                throw new Error('Unauthorized. Please login first.');
            }   

            try {
                const response = await requestFn();
                return response;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                    throw new Error('Unauthorized. Please login again.');
                }
                throw error;
            }
        }
    }
});
