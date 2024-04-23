<script setup lang="ts">
import DropdownNotification from '@/components/Header/DropdownNotification.vue'
import DropdownUser from '@/components/Header/DropdownUser.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { usersInfo, grivancesUrls } from '@/utils/apis';
import { useAuthStore } from '@/stores/authStore'
import { baseUrl } from '@/utils/baseUrl'
import { useAlertStore } from '@/stores/alert';
import { useDivisionsStore } from '@/stores/departmentsStore';
import { onMounted, ref } from 'vue';
import AlertWarning from '@/components/Alerts/AlertWarning.vue';
import router from '@/router';


interface grivance {
  id: string;
  created_at: string;
  current_responsible_division: any;
  current_responsible_sub_divifany: any;
  problem_type: any;
  responsible_division: any;
  responsible_sub_divifany: any;
  submitted_problem: string;
  problem_solved_state:boolean;

}

interface CurrentUser {
  id: string;
  first_name: string;
  last_name: string;
  role: number;
  username: string;
  email: string;
}
const alertStore = useAlertStore()
const authStore = useAuthStore()
const currentUser = ref<CurrentUser>();
const divisionStore = useDivisionsStore()

const isLoading = ref(false);
const user_geivances = ref<grivance[]>([]);



onMounted(async () => {
  try {
    isLoading.value = true
    const res = await authStore.getUserInfo(usersInfo.userInfo);

    console.log(res);
    if (res.role !== 2) {
      const rs = await authStore.logout()
      if (rs) {
        window.location.reload()
      }
    }

    if (res) {
      currentUser.value = res;
      try {
        const user_probs = await divisionStore.getUserGrivances(grivancesUrls.submitGrivance + `?querytype=user_prob&user_id=${currentUser.value?.id}`);
        console.log(user_probs);
        user_geivances.value = user_probs;
      } catch (error) {
        console.error('Error fetching divisions:', error);
        alertStore.addAlert({
          title: 'Error',
          message: "Fetching Grivance failed",
          duration: 3000,
          type: 'error'
        })
      }

    }


    // Further processing of division data if needed
  } catch (error: any) {
    console.error('Error fetching divisions:', error);
    alertStore.addAlert({
      title: 'Error',
      message: "Session Expired",
      duration: 3000,
      type: 'error'
    })
    const rs = await authStore.logout()
    if (rs) {
      window.location.reload()
    }
  } finally {
    isLoading.value = false
  }
})


const viewGrivance = (id:any) =>  {
     router.push('/grivances/grivance/' + id)
}


</script>

<template>
  <div>

    <AlertWarning />
    <header class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div class="flex items-center gap-2 sm:gap-4 ">
          <!-- Hamburger Toggle BTN -->
          <button
            class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden">
          </button>
          <!-- Hamburger Toggle BTN -->
          <router-link class="block flex-shrink-0 text-black font-bold " to="/">
            DIT GRIVANCE SUBMISSION
          </router-link>
        </div>
        <div class="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
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

              <input type="text" placeholder="Type to search..."
                class="w-full xl:w-125 bg-transparent pr-4 pl-9 focus:outline-none" />
            </div>
          </form>
        </div>

        <div class="flex items-center gap-3 2xsm:gap-7">
          <ul class="flex items-center gap-2 2xsm:gap-4">
            <ButtonDefault route="/grivances/submission" label="SUBMIT GRIVANCE"
              customClasses="bg-primary text-white text-xs rounded-lg -p-10">
              <span class="hidden sm:block">
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.8125 16.6656H2.1875C1.69022 16.6656 1.21331 16.4681 0.861675 16.1164C0.510044 15.7648 0.3125 15.2879 0.3125 14.7906V5.20935C0.3125 4.71207 0.510044 4.23516 0.861675 3.88353C1.21331 3.53189 1.69022 3.33435 2.1875 3.33435H17.8125C18.3098 3.33435 18.7867 3.53189 19.1383 3.88353C19.49 4.23516 19.6875 4.71207 19.6875 5.20935V14.7906C19.6875 15.2879 19.49 15.7648 19.1383 16.1164C18.7867 16.4681 18.3098 16.6656 17.8125 16.6656ZM2.1875 4.58435C2.02174 4.58435 1.86277 4.6502 1.74556 4.76741C1.62835 4.88462 1.5625 5.04359 1.5625 5.20935V14.7906C1.5625 14.9564 1.62835 15.1153 1.74556 15.2325C1.86277 15.3498 2.02174 15.4156 2.1875 15.4156H17.8125C17.9783 15.4156 18.1372 15.3498 18.2544 15.2325C18.3717 15.1153 18.4375 14.9564 18.4375 14.7906V5.20935C18.4375 5.04359 18.3717 4.88462 18.2544 4.76741C18.1372 4.6502 17.9783 4.58435 17.8125 4.58435H2.1875Z"
                    fill="" />
                  <path
                    d="M9.9996 10.6438C9.63227 10.6437 9.2721 10.5421 8.95898 10.35L0.887102 5.45001C0.744548 5.36381 0.642073 5.22452 0.602222 5.06277C0.58249 4.98268 0.578725 4.89948 0.591144 4.81794C0.603563 4.73639 0.631922 4.65809 0.674602 4.58751C0.717281 4.51692 0.773446 4.45543 0.839888 4.40655C0.906331 4.35767 0.981751 4.32236 1.06184 4.30263C1.22359 4.26277 1.39455 4.28881 1.5371 4.37501L9.60898 9.28126C9.7271 9.35331 9.8628 9.39143 10.0012 9.39143C10.1395 9.39143 10.2752 9.35331 10.3934 9.28126L18.4621 4.37501C18.5323 4.33233 18.6102 4.30389 18.6913 4.29131C18.7725 4.27873 18.8554 4.28227 18.9352 4.30171C19.015 4.32115 19.0901 4.35612 19.1564 4.40462C19.2227 4.45312 19.2788 4.51421 19.3215 4.58438C19.3642 4.65456 19.3926 4.73245 19.4052 4.81362C19.4177 4.89478 19.4142 4.97763 19.3948 5.05743C19.3753 5.13723 19.3404 5.21242 19.2919 5.27871C19.2434 5.34499 19.1823 5.40108 19.1121 5.44376L11.0402 10.35C10.7271 10.5421 10.3669 10.6437 9.9996 10.6438Z"
                    fill="" />
                </svg>
              </span>
            </ButtonDefault>
            <!-- Notification Menu Area -->
            <div class="hidden sm:block">
              <DropdownNotification />
            </div>

            <!-- Notification Menu Area -->

          </ul>

          <!-- User Area -->
          <DropdownUser is-student name="Jullu" />
          <!-- User Area -->
        </div>
      </div>
    </header>


    <div class="w-full max-w-full px-3 mt-6 md:flex-none">
      <div
        class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
        <div class="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
          <h6 class="mb-0 dark:text-white">ALL YOUR SUBMITTED GRIVANCES</h6>
        </div>
        <div class="flex-auto p-4 pt-6">
          <ul class="flex flex-col pl-0 mb-0 rounded-lg">
            <template v-if="isLoading">
              <li
                class="relative flex h-26 p-6 mb-2 border-0 rounded-t-inherit rounded-xl dark:bg-slate-850 bg-slate-200 animate-pulse">

              </li>
              <li
                class="relative flex h-26 p-6 mb-2 border-0 rounded-t-inherit rounded-xl dark:bg-slate-850 bg-slate-200 animate-pulse">

              </li>
              <li
                class="relative flex h-26 p-6 mb-2 border-0 rounded-t-inherit rounded-xl dark:bg-slate-850 bg-slate-200 animate-pulse">

              </li>
              <li
                class="relative flex h-26 p-6 mb-2 border-0 rounded-t-inherit rounded-xl dark:bg-slate-850 bg-slate-200 animate-pulse">

              </li>
            </template>
            <template v-else-if="user_geivances.length == 0">
              <div>
                you havent subbmitted any grivance
              </div>
            </template>
            <template v-else v-for="(grivance, index) in user_geivances" :key="index">
              <div>
                <li
                  class="relative flex p-6 mb-2 border-0 rounded-t-inherit rounded-xl bg-gray-50 dark:bg-slate-850 hover:bg-slate-200"
                  @click="viewGrivance(grivance.id)"
                  >
                  <div class="flex flex-col">
                    <h6 class="mb-4 text-sm leading-normal dark:text-white">{{ grivance.submitted_problem.substring(0, 50) }}...</h6>
                    <span class="mb-2 text-xs leading-tight dark:text-white/80">current responsible division: {{ grivance.current_responsible_division?.name }}</span>
                    <span class="mb-2 text-xs leading-tight dark:text-white/80">current responsible division: {{ grivance.current_responsible_sub_divifany?.name }} </span>
                    <span class="text-xs leading-tight dark:text-white/80">CONTACT INFO: <span
                        class="font-semibold text-slate-700 dark:text-white sm:ml-2">{{grivance.current_responsible_division?.admin.phone_number}}</span></span>
                  </div>
                  <div class="ml-auto text-right">
                    <a class="relative z-10 inline-block px-4 py-2.5 mb-0 font-bold text-center  align-middle transition-all border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 bg-gradient-to-tl from-red-600 to-orange-600 hover:-translate-y-px active:opacity-85 bg-x-25 bg-clip-text"
                      href="javascript:;"><i
                        class="mr-2 far fa-trash-alt bg-150 bg-gradient-to-tl from-red-600 to-orange-600 bg-x-25 bg-clip-text"></i>Grivance State</a>
                    <template v-if="grivance.problem_solved_state">
                      <div>
                        <a class="inline-block dark:text-white px-4 py-2.5 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 hover:-translate-y-px active:opacity-85 bg-x-25 text-slate-700 bg-green-700 animate-pulse"
                      href="javascript:;"><i class="mr-2 fas fa-pencil-alt text-slate-700"
                        aria-hidden="true"></i>SOLVED</a>
                      </div>
                    </template>
                    <template v-else>
                      <div>
                        <a class="inline-block dark:text-white px-4 py-2.5 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 hover:-translate-y-px active:opacity-85 bg-x-25 text-slate-700 bg-yellow-500 animate-pulse"
                      href="javascript:;"><i class="mr-2 fas fa-pencil-alt text-slate-700"
                        aria-hidden="true"></i>PENDING</a>
                      </div>
                    </template>
                  </div>
                </li>
              </div>
            </template>





          </ul>
        </div>
      </div>
    </div>


  </div>
</template>
<style></style>