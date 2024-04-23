import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import axios from 'axios';

interface Divisions {
  id: string;
  name: string;
  admin: string;
  type: string;
}

export const useDivisionsStore = defineStore('divisions', () => {
  const divisions = ref<Divisions[]>();

  const  getDivisions = async (url:string) =>  {
    // const token = localStorage.getItem('token');
    // const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
        const response = await axios.get(url);
        console.log(response.data);
        
        divisions.value = response.data;
        if (response) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }

  }
  const  postDivision = async (url:string, data:any) =>  {
    // const token = localStorage.getItem('token');
    // const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
        const response = await axios.post(url, data );
        console.log(response.data);
       
        if (response) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }

  }
  const  getSubDivisions = async (url:string) =>  {
    // const token = localStorage.getItem('token');
    // const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
        const response = await axios.get(url);
        
        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }

  }

  const  getProblemType = async (url:string) =>  {
    // const token = localStorage.getItem('token');
    // const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
        const response = await axios.get(url);
        
        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
      console.log(error);
      
        throw error;
    }

  }

  const getUserGrivances = async (url:string)  => {
    const token = localStorage.getItem('token');
    const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
      const response = await axios.get(url, header);
        
      if (response.status === 200) {
          return response.data;
      }
      
    } catch (error) {
      console.log(error);
      throw error;
      
    }

  }
  const getAllProblems = async (url:string)  => {
    const token = localStorage.getItem('token');
    const header = { headers : {Authorization: 'Bearer ' + token}}

    try {
      const response = await axios.get(url, header);
        
      if (response.status === 200) {
          return response.data;
      }
      
    } catch (error) {
      console.log(error);
      throw error;
      
    }

  }
  return {
    divisions,
    getDivisions,
    getSubDivisions,
    getProblemType,
    getUserGrivances,
    getAllProblems,
    postDivision
  };
});
