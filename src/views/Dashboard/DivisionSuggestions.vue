<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { DivisionUrls, usersInfo } from '@/utils/apis'
import { renderDateTime } from '@/utils/dateFormater';
import { useDivisionsStore } from '@/stores/departmentsStore'
import router from '@/router'
import axios from 'axios'

interface CUser {
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
    id: string;
    created_at: string;
    division: any;
    type: number;
    message: string;

}

const alertStore = useAlertStore()
const authStore = useAuthStore()
const divisionStore = useDivisionsStore()


const pageTitle = ref('Division Suggestions and Congraturations');
const isLoading = ref(false);
const admin = ref<CUser>();
const grivances = ref<grivance[]>([])

onMounted(async () => {
    try {
        isLoading.value = true
        const res = await authStore.getUserInfo(usersInfo.userInfo);

        console.log(res);

        if (res) {
            admin.value = res;
            try {
                const user_probs = await divisionStore.getUserGrivances(DivisionUrls.suggestions);
                console.log(user_probs);
                const division_grivances = await user_probs?.filter((grivance: grivance) => grivance.division?.admin.id == admin?.value?.id)
                grivances.value = division_grivances;
            } catch (error) {
                console.error('Error fetching grivances:', error);
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

    } finally {
        isLoading.value = false
    }
})

const viewGrivance =async (id: any) => {
    const res = await axios.delete(`${DivisionUrls.suggestions}/${id}/`)
    if (res) {
        alertStore.addAlert({
                    title: 'Success',
                    message: "Suggesstion deleted",
                    duration: 3000,
                    type: 'success'
                })
        const user_probs = await divisionStore.getUserGrivances(DivisionUrls.suggestions);
        const division_grivances = await user_probs?.filter((grivance: grivance) => grivance.division?.admin.id == admin?.value?.id)
        grivances.value = division_grivances;
    }
    
}

</script>

<template>
    <DefaultLayout>

        <!-- Breadcrumb Start -->
        <BreadcrumbDefault :pageTitle="pageTitle" />

        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
                <h4 class="text-xl font-bold text-black dark:text-white">Suggestions</h4>
            
            </div>

            <!-- Table Header -->
            <div
                class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div class="col-span-1 flex items-center">
                    <p class="font-medium">Type</p>
                </div>
                <div class="col-span-1 hidden items-center sm:flex">
                    <p class="font-medium">Date submitted</p>
                </div>
                <div class="col-span-3 flex items-center">
                    <p class="font-medium">Message</p>
                </div>
             
                <div class="col-span-1 flex items-center">
                    <p class="font-medium">Division</p>
                </div>
            </div>

            <template v-if="isLoading">
                <div class="py-3 text-center">
                    Loading ...........
                </div>
            </template>
            <template v-else-if="grivances.length === 0">
                <div class="py-3 text-center">
                    There is no active Suggestions or Congraturational greatings for this division
                </div>
            </template>
            <template v-else>
                <div v-for="grvs in grivances" :key="grvs.id"
                    class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 ">
                    <div class="col-span-1 flex items-center">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <p class="text-sm font-medium text-black dark:text-white" v-if="grvs.type === 2">
                                Congraturational greatings
                            </p>
                            <p class="text-sm font-medium text-black dark:text-white" v-else>
                                suggestion
                            </p>
                        </div>
                    </div>
                    <div class="col-span-1 hidden items-center sm:flex">
                        <p class="text-sm font-medium text-black dark:text-white">{{ renderDateTime(grvs.created_at) }}
                        </p>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <p class="text-sm font-medium text-black dark:text-white">{{
            grvs.message.substring(0, 70) }}...</p>
                    </div>
                    <div class="col-span-1 flex items-center">
                        <p class="text-sm font-medium text-black dark:text-white">{{
            grvs?.division?.name }}</p>
                    </div>
       
                    <div class="col-span-1 flex items-center">

                        <button class="hover:text-primary" @click="viewGrivance(grvs.id)">
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
                    </div>

                </div>
            </template>
            <!-- Table Rows -->

        </div>

    </DefaultLayout>
</template>
