<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { grivancesUrls, usersInfo, problemsUrl, DivisionUrls } from '@/utils/apis'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { renderDateTime } from '@/utils/dateFormater'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import router from '@/router'


interface CUser {
  id: string
  first_name: string
  last_name: string
  role: number
  username: string
  email: string
  phone_number: string
  profile: string
}

interface divisionInterface {
  id: string
  created_at: string
  name: string
  admin: any
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


const viewProblem = (id:any) =>  {
     router.push('/dashboard/problem_type/' + id)
}

const pageTitle = ref('Problem Types')
const isLoading = ref(false)
const admin = ref<CUser>()
const problem_types = ref<grivance[]>([])
const allDivisions = ref<divisionInterface[]>()
const add_type = ref(false)
const problem_name = ref()
const selected_division = ref<string>()
const time_required = ref()
const isAddLoading = ref(false)

const loadProblems = async () => {
  try {
    isLoading.value = true
    const res = await authStore.getUserInfo(usersInfo.userInfo)

    console.log(res)

    if (res) {
      admin.value = res
      try {
        const probs = await divisionStore.getAllProblems(
          problemsUrl.allProblemsTypes + `?querytype=all`
        )
        const ress = await divisionStore.getAllProblems(
          DivisionUrls.allDivisions + `?querytype=all`
        )
        console.log(probs)
        // const division_grivances = await user_probs?.filter((grivance: grivance) => grivance.current_responsible_division?.admin.id == admin?.value?.id)
        problem_types.value = probs
        allDivisions.value = ress
      } catch (error) {
        console.error('Error fetching problemtypes:', error)
        alertStore.addAlert({
          title: 'Error',
          message: 'Fetching Grivance failed',
          duration: 3000,
          type: 'error'
        })
      }
    }

    // Further processing of division data if needed
  } catch (error: any) {
    console.error('Error fetching divisions:', error)
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

const addProlemType = async () => {
  try {
    isAddLoading.value = true
    const body = {
      type_name: problem_name.value,
      time_required: time_required.value,
      responsible_division: selected_division.value
    }

    if (problem_name.value && time_required.value && selected_division.value) {
      const response: any = await divisionStore.postDivision(problemsUrl.allProblemsTypes, body)

      if (response?.save) {
        alertStore.addAlert({
          title: 'Success',
          message: 'problem type added successfully',
          duration: 3000,
          type: 'success'
        })
        add_type.value = false
        problem_name.value = ''
        selected_division.value = ''
        time_required.value = ''
        loadProblems()
      } else {
        alertStore.addAlert({
          title: 'Error',
          message: 'Failed to add problem type',
          duration: 3000,
          type: 'error'
        })
      }
      isAddLoading.value = false
    }
    add_type.value = false
    return
  } catch (error) {
    alertStore.addAlert({
      title: 'Error',
      message: 'Failed to add problem type',
      duration: 3000,
      type: 'error'
    })
  }
}
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
        <h4 class="text-xl font-bold text-black dark:text-white">Problem types</h4>
        <form action="#">
          <div class="relative">
            <button class="absolute top-1/2 left-0 -translate-y-1/2">
              <svg
                class="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search name.."
              class="w-full xl:w-125 bg-transparent pr-4 pl-9 focus:outline-none"
            />
          </div>
        
        </form>

        <div @click="add_type = true">
            <ButtonDefault
              route=""
              label="Add Problem Type"
              customClasses="bg-primary text-white text-xs rounded-lg -p-10"
            >
            </ButtonDefault>
          </div>
      </div>

      <!-- Table Header -->
      <div
        class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
      >
        <div class="col-span-2 flex items-center">
          <p class="font-medium">Problem Type</p>
        </div>
        <div class="col-span-2 hidden items-center sm:flex">
          <p class="font-medium">Date created</p>
        </div>

        <div class="col-span-2 flex items-center">
          <p class="font-medium">Responsible Devision name</p>
        </div>
        <div class="col-span-2 flex items-center">
          <p class="font-medium">Time required</p>
        </div>
        <div class="col-span-1 flex items-center">
          <p class="font-medium"></p>
        </div>
      </div>

      <template v-if="isLoading">
        <div>Loading ...........</div>
      </template>
      <template v-else>
        <div
          v-for="type in problem_types"
          :key="type.id"
          class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
          <div class="col-span-2 flex items-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p class="text-sm font-medium text-black dark:text-white">{{ type?.type_name }}</p>
            </div>
          </div>
          <div class="col-span-2 hidden items-center sm:flex">
            <p class="text-sm font-medium text-black dark:text-white">
              {{ renderDateTime(type.created_at) }}
            </p>
          </div>
          <div class="col-span-2 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">
              {{ type.responsible_division?.name }}
            </p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">{{ type.time_required }}</p>
          </div>
          <!-- <div class="col-span-1 flex items-center">
                        <p class="text-sm font-medium text-meta-3" v-if="grvs.problem_solved_state">
                            Solved
                        </p>
                        <p class="text-sm font-medium text-meta-6" v-else-if="!grvs.problem_solved_state">
                            Pending
                        </p>

                    </div> -->
          <div class="col-span-1 flex items-center">
            <button class="hover:text-primary"
            @click="viewProblem(type.id)"
            >
              <svg
                class="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                  fill=""
                />
                <path
                  d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
      <!-- Table Rows -->
    </div>

    <!--view -->
    <div
      :class="`modal ${
        !add_type && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
        @click="add_type = false"
      />

      <div
        class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded-xl modal-container md:max-w-md shadow-2xl"
        style="border: 1px solid; border-color: #01579b; box-shadow: 0px 0px 6px #01579b"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal -->
        <div class="px-6 py-4 text-left modal-content">
          <!-- Title -->
          <div class="flex items-center justify-between pb-3">
            <p class="text-lg font-bold">Add Problem Type</p>
            <div class="z-50 cursor-pointer modal-close" @click="add_type = false">
              <svg
                class="text-black fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!-- Form -->
          <form>
            <div class="mb-6 mt-3">
              <label class="mb-2.5 block text-black dark:text-white"> Problem type name </label>
              <textarea
                rows="1"
                placeholder="name"
                required
                v-model="problem_name"
                class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ></textarea>
            </div>

            <div class="mb-6 mt-3">
              <label class="mb-2.5 block text-black dark:text-white">Time required in days </label>
              <input
                placeholder="days"
                required
                v-model="time_required"
                type="number"
                class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <!-- Input 1 -->
            <div class="mb-4">
              <label class="mb-2.5 block text-black dark:text-white">Responsible Division </label>
              <select
                v-model="selected_division"
                class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              >
                <template v-for="(div, index) in allDivisions" :key="index">
                  <option :value="div.id">{{ div.name }}</option>
                </template>
              </select>
            </div>
          </form>

          <div class="flex justify-end pt-2">
            <button
              class="p-3 px-6 py-3 text-sm mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
              style="color: #01579b"
              @click="add_type = false"
            >
              Close
            </button>
            <button
              v-if="isAddLoading"
              class="px-6 py-2 text-sm font-medium opacity-40 tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              style="background-color: #01579b"
            >
              Adding...
            </button>
            <button
              v-if="!isAddLoading"
              @click="addProlemType"
              class="px-6 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              style="background-color: #01579b"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
