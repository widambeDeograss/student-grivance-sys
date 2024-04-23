<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { DivisionUrls, usersInfo } from '@/utils/apis'
import { useDivisionsStore } from '@/stores/departmentsStore'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'


interface divisionInterface {
    id: string;
    created_at: string;
    name: string;
    admin: any
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

const alertStore = useAlertStore()
const authStore = useAuthStore()
const divisionStore = useDivisionsStore()


const pageTitle = ref('Add Division');
const isLoading = ref(false);
const isSubmitLoading = ref(false);
const users = ref<User[]>([]);
const adminSelected = ref();
const div_name = ref();
const error = ref();

onMounted(async () => {
    try {
        isLoading.value = true
        const ress = await authStore.getAllUsers(usersInfo.allUsers + `?querytype=all`);

        if (ress) {
            users.value = ress.filter((user: User) => user.role === 3);
            console.log(users.value);
        }

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
});

const handleSubmitDivision = async () => {
    try {
        isSubmitLoading.value = true;
        const body = {
            name: div_name.value,
            admin: adminSelected.value
        }
        console.log(body);

        const response = await divisionStore.postDivision(DivisionUrls.allDivisions, body);
        if (response.save) {
            alertStore.addAlert({
                title: 'Success',
                message: 'Division added successfully',
                duration: 3000,
                type: 'success'
            })
            div_name.value = "";
            adminSelected.value = "";
        } else {
            error.value = response.error.admin[0]
            alertStore.addAlert({
                title: 'Error',
                message: 'Failed add division',
                duration: 3000,
                type: 'error'
            })
        }
        isSubmitLoading.value = false;
    } catch (error) {
        alertStore.addAlert({
            title: 'Error',
            message: 'Failed add division',
            duration: 3000,
            type: 'error'
        })
    }
}
</script>

<template>
    <DefaultLayout>
        <AlertWarning />
        <!-- Breadcrumb Start -->
        <BreadcrumbDefault :pageTitle="pageTitle" />

        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
                <h4 class="text-xl font-bold text-black dark:text-white">All Divisions</h4>


            </div>

            <div class="w-full max-w-full px-3 mt-6 md:flex-none">
                <div
                    class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8">
                    <div class="  pb-0 mb-0 border-b-0 rounded-t-2xl">
                        <!-- <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6> -->
                    </div>

                    <div class="mt-6 ">
                        <template v-if="isLoading">
                            <div class="flex flex-wrap justify-start items-center gap-6 w-full mt-3">
                                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg ">
                                </div>
                                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg ">
                                </div>
                                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg ">
                                </div>
                            </div>
                        </template>
                        <template v-else>

                            <p class="text-red">{{ error }}</p>

                            <form @submit.prevent="handleSubmitDivision">

                                <div class="mb-4">
                                    <label class="mb-2.5 block text-black dark:text-white"> Division Admin </label>
                                    <select v-model="adminSelected"
                                        class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
                                        <template v-for="(user, index) in users" :key="index">

                                            <option :value='user.id'>{{ user.email }}</option>

                                        </template>


                                    </select>


                                </div>

                                <div class="mb-6 mt-3">
                                    <label class="mb-2.5 block text-black dark:text-white"> Division Name </label>
                                    <textarea rows="1" placeholder="name" required v-model="div_name"
                                        class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
                                </div>

                                <button v-if="!isSubmitLoading" type="submit"
                                    class="flex w- justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 sm:w-full  w-full">
                                    Add Division
                                </button>
                                <button v-if="isSubmitLoading" type="submit"
                                    class="flex w- justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 sm:w-full  w-full">
                                    Adding Division....
                                </button>

                            </form>

                        </template>

                    </div>


                    <!-- <div class="mb-6 mt-3" v-if="selectedDepartmentId">
                                <label class="mb-2.5 block text-black dark:text-white"> Select problem type </label>
                                <select v-model="problemtype_selected"
                                    class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
                                    <template v-for="(item, index) in problemtypes" :key="item?.id">
                                        <option :value="item.id">{{ item?.type_name }}</option>
                                    </template>

                                </select>
                            </div> -->

                </div>
            </div>



        </div>

    </DefaultLayout>
</template>
