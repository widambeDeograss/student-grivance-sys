<script setup lang="ts">
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import BreadcrumbDefault from '../../components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '../../stores/alert'
import { useAuthStore } from '../../stores/authStore'

import { DivisionUrls, problemsUrl, usersInfo } from '../../utils/apis'
import { useDivisionsStore } from '../../stores/departmentsStore';
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'


interface subdivisionInterface {
  id: string;
  created_at: string;
  name: string;
  admin: any;
  division: any
}

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


interface grivance {
  id: string
  created_at: string
  type_name: any
  responsible_division: any
  responsible_sub_divifany: any
  time_required: string
}


const alertStore = useAlertStore()
const authStore = useAuthStore()
const divisionStore = useDivisionsStore()
const selectedUser = ref<User>();

const pageTitle = ref('Divisions');
const isLoading = ref(false);
const sub_divisions = ref<subdivisionInterface[]>([]);
const addModal = ref(false);
const isAddLoading = ref(false);
const name = ref();
const divisionId = ref();

const users = ref<User[]>([]);
const problem_types = ref<grivance[]>([])

const loadProblems = async () => {
  try {
    isLoading.value = true
    const res = await authStore.getUserInfo(usersInfo.userInfo);
    const usersRes = await authStore.getAllUsers(usersInfo.allUsers + `?querytype=all`);

    if (res) {
      
      try {
        const ress = await divisionStore.getAllProblems(DivisionUrls.subDivision + `?querytype=all`);
        const probs = await divisionStore.getAllProblems(
          problemsUrl.allProblemsTypes + `?querytype=all`
        )
        const resDiv = await divisionStore.getAllProblems(DivisionUrls.allDivisions + `?querytype=all`);

        const division_subs = await ress?.filter((sub: subdivisionInterface) => sub.division?.admin.id == res?.id);
        const division = await resDiv?.filter((sub: any) => sub.admin.id == res?.id);
        const subdivision_admin = await usersRes.filter((user: User) => user.role === 4);
        const division_grivances = await probs?.filter((grivance: grivance) => grivance.responsible_sub_divifany?.admin.id == res?.id)
        problem_types.value = division_grivances
        users.value = subdivision_admin;
        sub_divisions.value = division_subs
        divisionId.value = division[0].id;

      } catch (error) {
        console.error('Error fetching subdivisions:', error)
        alertStore.addAlert({
          title: 'Error',
          message: 'Error fetching subdivisions',
          duration: 3000,
          type: 'error'
        })
      }
    }

    // Further processing of division data if needed
  } catch (error: any) {
    console.error('Error fetching subdivisions:', error)
    alertStore.addAlert({
      title: 'Error',
      message: 'Session Expired',
      duration: 3000,
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadProblems()
})

const addSubdivision = async () => {
  try {
    isAddLoading.value = true;
    const body = {
      admin: selectedUser.value,
      name: name.value,
      division: divisionId.value
    }
    console.log(body);

    if (selectedUser.value && divisionId.value) {
      const res = await authStore.changeRole(DivisionUrls.subDivision, body);

      if (res?.save) {
        alertStore.addAlert({
          title: 'Success',
          message: `${name} sub divison added successfully`,
          duration: 3000,
          type: 'success'
        })
        addModal.value = false;
        loadProblems();
      } else {
        alertStore.addAlert({
          title: 'Erroe',
          message: 'Failed to add sub division, choose different admin',
          duration: 3000,
          type: 'error'
        })
      }
    }

    isAddLoading.value = false;

  } catch (error) {
    alertStore.addAlert({
      title: 'Erroe',
      message: 'Failed to change role',
      duration: 3000,
      type: 'error'
    })

  } finally {
    isAddLoading.value = false;
  }
}


</script>
<template>
  <DefaultLayout>

    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
        <h4 class="text-xl font-bold text-black dark:text-white">All Divisions</h4>
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
        <div
        @click="addModal=true"
        >
          <ButtonDefault route="#" label="ADD SUB-DIVISION"
          customClasses="bg-primary text-white text-xs rounded-lg -p-10">

        </ButtonDefault>
        </div>
      </div>

      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div class="max-w-full overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Sub-division
                </th>
                <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Sub-division Phone
                </th>
                <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Admin name</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <template v-if="isLoading">
              <div class="py-3 text-center">
                Loading ...........
              </div>
            </template>
            <template v-else-if="sub_divisions.length === 0">
              <div class="py-3 text-center">
                There is no active sub-divisions for this division
              </div>
            </template>
            <template v-else>
              <tbody>
                <tr v-for="(item, index) in sub_divisions" :key="index">
                  <td class="py-5 px-4 pl-9 xl:pl-11">
                    <h5 class="font-medium text-black dark:text-white">{{ item.name }}</h5>
                    <p class="text-sm">{{ item?.admin.email }}</p>
                  </td>
                  <td class="py-5 px-4">
                    <p class="text-black dark:text-white">{{ item?.admin.phone_number }}</p>
                  </td>
                  <td class="py-5 px-4">
                    <p
                      class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                      {{ item?.admin.first_name }}
                    </p>
                  </td>
                  <td class="py-5 px-4">
                    <div class="flex items-center space-x-3.5">
                      <button class="hover:text-primary">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill="" />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill="" />
                        </svg>
                      </button>

                      <button class="hover:text-primary">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill="" />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill="" />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill="" />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill="" />
                        </svg>
                      </button>

                      <button class="hover:text-primary">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                            fill="" />
                          <path
                            d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                            fill="" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>
      </div>


      <!--view -->
      <div :class="`modal ${!addModal && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
        <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="addModal = false" />

        <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded-xl  modal-container md:max-w-md shadow-2xl"
          style="border: 1px solid; border-color: #01579b; box-shadow: 0px 0px 6px #01579b;">


          <!-- Add margin if you want to see some of the overlay behind the modal -->
          <div class="px-6 py-4 text-left modal-content">
            <!-- Title -->
            <div class="flex items-center justify-between pb-3">
              <p class="text-lg font-bold">
                Add Subdivision
              </p>
              <div class="z-50 cursor-pointer modal-close" @click="addModal = false">
                <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 18 18">
                  <path
                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
              </div>
            </div>
            <form class="p-10">
            <div class="mb-6 mt-3">
              <label class="mb-2.5 block text-black dark:text-white">Sub Division Name </label>
              <textarea rows="1" placeholder="name" required v-model="name"
                class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
            </div>
              <!-- Input 1 -->

              <p class="text-sm font-bold">
                select admin
              </p>
              <select v-model="selectedUser"
                class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
                <template v-for="(item, index) in users" :key="index">
               
                    <option :value="item.id">{{ item.first_name }} {{ item.last_name }}</option>             
             
                </template>              
              </select>
              <!-- <p class="text-sm font-bold">
                select problem type
              </p>
              <select v-model="selectedUser"
                class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
                <template v-for="(item, index) in problem_types" :key="index">
               
                    <option :value="item.id">{{ item.type_name }}</option>             
             
                </template>              
              </select> -->
            </form>
            <!-- Footer -->
            <div class="flex justify-end pt-2">
              <button
                class="p-3 px-6 py-3 text-sm mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
                style="color: #01579B;" @click="addModal = false">
                Close
              </button>
              <button v-if="isAddLoading"
                class="px-6 py-2 text-sm font-medium opacity-40 tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                style="background-color: #01579B;">
                Updating...
              </button>
              <button v-if="!isAddLoading" @click="addSubdivision"
                class="px-6 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                style="background-color: #01579B;">
                Add subdivision
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

  </DefaultLayout>
</template>
<style></style>