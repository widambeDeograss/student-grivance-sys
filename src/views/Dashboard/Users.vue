<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { usersInfo, authUrls } from '@/utils/apis'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'


interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: number;
  username: string;
  email: string;
  phone_number: string;
  profile: string;
}

const alertStore = useAlertStore()
const authStore = useAuthStore()


const pageTitle = ref('Users');
const isLoading = ref(false);
const users = ref<User[]>([]);
const edit = ref(false);
const selectedUser = ref<User>();
const roleSelected = ref<number>();
const isChangeLoading = ref(false);

const loadUsers = async () =>  {
  try {
    isLoading.value = true
    const ress = await authStore.getAllUsers(usersInfo.allUsers + `?querytype=all`);
    console.log(ress);
    users.value = ress;

    //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);


    // Further processing of division data if needed
  } catch (error) {
    console.error('Error fetching Users:', error)
    alertStore.addAlert({
      title: 'Error',
      message: 'Failed to fetch users',
      duration: 3000,
      type: 'error'
    })


  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadUsers()
});

const openRoleChangeModal = (user: User) => {
  edit.value = true;
  selectedUser.value = user;
}


const changeRole = async () => {
  try {
    isChangeLoading.value = true;
     const body = {
      id:selectedUser.value?.id,
      role:roleSelected.value
     }
    console.log(body);
    
    if (selectedUser.value && roleSelected.value) {
      const res = await authStore.changeRole(authUrls.rolesChange, body);

      if (res?.save) {
        alertStore.addAlert({
                title: 'Success',
                message: `Role ${selectedUser.value.username} changed successfully`,
                duration: 3000,
                type: 'success'
            })
            edit.value = false;
            loadUsers();
      } else {
        alertStore.addAlert({
                title: 'Erroe',
                message: 'Failed to change role',
                duration: 3000,
                type: 'error'
            })
      }
    }

    isChangeLoading.value = false;

  } catch (error) {
    alertStore.addAlert({
                title: 'Erroe',
                message: 'Failed to change role',
                duration: 3000,
                type: 'error'
            })
    
  }finally{
    isChangeLoading.value = false;
  }
}
</script>

<template>
  <DefaultLayout>

    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
        <h4 class="text-xl font-bold text-black dark:text-white">All Users</h4>
        <form action="#">
          <div class="relative">
            <button class="absolute top-1/2 left-0 -translate-y-1/2">
              <svg class="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" width="20"
                height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill="" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill="" />
              </svg>
            </button>

            <input type="text" placeholder="Search name.."
              class="w-full xl:w-125 bg-transparent pr-4 pl-9 focus:outline-none" />
          </div>
        </form>
      </div>

      <!-- Table Header -->
      <div
        class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div class="col-span-2 flex items-center">
          <p class="font-medium">Name</p>
        </div>
        <div class="col-span-1 hidden items-center sm:flex">
          <p class="font-medium">Username</p>
        </div>
        <div class="col-span-2 flex items-center">
          <p class="font-medium">Email</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="font-medium">Phone</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="font-medium">Role</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="font-medium"></p>
        </div>
      </div>


      <!-- Table Rows -->
      <div v-for="user in users" :key="user.id"
        class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div class="col-span-2 flex items-center">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div class="h-12.5 w-15 rounded-md">
              <img :src="user.profile" :alt="`${user.username}`" />
            </div>
            <p class="text-sm font-medium text-black dark:text-white">{{ user.first_name + " " + user.last_name }}</p>
          </div>
        </div>
        <div class="col-span-1 hidden items-center sm:flex">
          <p class="text-sm font-medium text-black dark:text-white">{{ user.username }}</p>
        </div>
        <div class="col-span-2 flex items-center">
          <p class="text-sm font-medium text-black dark:text-white">{{ user.email }}</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="text-sm font-medium text-black dark:text-white">{{ user.phone_number }}</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="text-sm font-medium text-meta-3" v-if="user.role == 2">
            Normal User
          </p>
          <p class="text-sm font-medium text-meta-3" v-else-if="user.role == 3">
            Division Admin
          </p>
          <p class="text-sm font-medium text-meta-3" v-else-if="user.role == 4">
            SubDivision Admin
          </p>
        </div>
        <div class="col-span-1 flex items-center">
          <!-- <p class="text-sm font-medium text-meta-3">${{ user.role }}</p> -->
          <button class="hover:text-primary" @click="openRoleChangeModal(user)" v-if="user.role !== 1">
           <img src="../../assets/images/icon/icons8-edit-128.svg" alt="" srcset="" class="h-6 w-6">
          </button>
        </div>
      </div>
    </div>

    <!--view -->
    <div :class="`modal ${!edit && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
      <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="edit = false" />

      <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded-xl  modal-container md:max-w-md shadow-2xl"
        style="border: 1px solid; border-color: #01579b; box-shadow: 0px 0px 6px #01579b;">


        <!-- Add margin if you want to see some of the overlay behind the modal -->
        <div class="px-6 py-4 text-left modal-content">
          <!-- Title -->
          <div class="flex items-center justify-between pb-3">
            <p class="text-lg font-bold">
              Update User Role
            </p>
            <div class="z-50 cursor-pointer modal-close" @click="edit = false"  >
              <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 18 18">
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </svg>
            </div>
          </div>

          <p class="text-sm font-bold">
              Update Role for {{ selectedUser?.first_name + ' ' + selectedUser?.last_name }}
            </p>
            <p class="text-sm font-medium text-meta-3" v-if="selectedUser?.role == 2">
            Current role : Normal User
          </p>
          <p class="text-sm font-medium text-meta-3" v-else-if="selectedUser?.role == 3">
            Current role : Division Admin
          </p>
          <p class="text-sm font-medium text-meta-3" v-else-if="selectedUser?.role == 4">  
            Current role : SubDivision Admin
          </p>
         
          <form class="p-10">
            <!-- Input 1 -->
            
            <p class="text-sm font-bold">
              select role
            </p>
            <select v-model="roleSelected"
              class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
              <option value='2'>Normal User</option>
              <option value='3'>Division admin</option>
              <option value='4'>sub division admin</option>
            </select>


          </form>


          <!-- Footer -->
          <div class="flex justify-end pt-2">
            <button
              class="p-3 px-6 py-3 text-sm mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
              style="color: #01579B;" @click="edit = false">
              Close
            </button>
            <button
            v-if="isChangeLoading"
              class="px-6 py-2 text-sm font-medium opacity-40 tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              style="background-color: #01579B;">
              Updating...
            </button>
            <button
            v-if="!isChangeLoading"
            @click="changeRole"
              class="px-6 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              style="background-color: #01579B;">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>


  </DefaultLayout>
</template>
