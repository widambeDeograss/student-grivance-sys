<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { grivancesUrls, usersInfo } from '@/utils/apis'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { renderDateTime } from '@/utils/dateFormater';
import { useDivisionsStore } from '@/stores/departmentsStore';
import { useRoute } from 'vue-router'


interface grivanceType {
    id: string;
    created_at: string;
    current_responsible_division: any;
    current_responsible_sub_divifany: any;
    problem_type: any;
    responsible_division: any;
    responsible_sub_divifany: any;
    submitted_problem: string;
    problem_solved_state: boolean;
    user_submitted: any
}

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRoute()
const divisionStore = useDivisionsStore();

const pageTitle = ref('Grivace Details');
const isLoading = ref(false);
const data = ref<grivanceType>();

console.log();
onMounted(async () => {
    try {
        isLoading.value = true
        const ress = await divisionStore.getProblemType(grivancesUrls.submitGrivance + `?querytype=single_prob&id=${router.params.id}`);
        console.log(ress);
        data.value = ress;

        //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);


        // Further processing of division data if needed
    } catch (error) {
        console.error('Error fetching Divisions:', error)
        alertStore.addAlert({
            title: 'Error',
            message: 'Failed to fetch Divisions',
            duration: 3000,
            type: 'error'
        })


    } finally {
        isLoading.value = false
    }
});

</script>

<template>
    <DefaultLayout>

        <!-- Breadcrumb Start -->
        <BreadcrumbDefault :pageTitle="pageTitle" />


        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">


            <div class="card p-3">
                <div class="card-body">
                    <div class="table-top">
                        <div class="search-set">
                            <div class="flex justify-between items-center ">
                                <div class="p-3">
                                    Grivace Details
                                </div>
                                <div class="p-1" v-if="!data?.problem_solved_state">
                                    <ButtonDefault route="" label="SOLVE GRIVANCE"
                                        customClasses="bg-primary text-white text-xs rounded-lg -p-10">
                                        <span class="hidden sm:block">

                                        </span>
                                    </ButtonDefault>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table datanew w-full p-5 text-left">
                            <thead>
                                <tr>
                                    <th class="border px-1 py-2">Category name</th>
                                    <th class="border px-1 py-2">Reference</th>
                                </tr>
                            </thead>
                            <tbody class="p-3">
                                <tr>
                                    <th>ID</th>
                                    <td>{{ data?.id }}</td>
                                </tr>
                                <tr>
                                    <th>Submitted Problem</th>
                                    <td>{{ data?.submitted_problem }}</td>
                                </tr>
                                <tr>
                                    <th>Created At</th>
                                    <td>{{ data?.created_at }}</td>
                                </tr>
                                <tr>
                                    <th>Problem Solved State</th>
                                    <td>
                                        <p class="text-sm font-medium text-meta-3" v-if="data?.problem_solved_state">
                                            Solved
                                        </p>
                                        <p class="text-sm font-medium text-meta-6"
                                            v-else-if="!data?.problem_solved_state">
                                            Pending
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Problem Type</th>
                                    <td>{{ data?.problem_type.type_name }}</td>
                                </tr>
                                <tr>
                                    <th>Time Required</th>
                                    <td>{{ data?.problem_type.time_required }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Division</th>
                                    <td>{{ data?.problem_type.responsible_division.name }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Sub Division</th>
                                    <td>{{ data?.problem_type.responsible_sub_divifany.name }}</td>
                                </tr>
                                <tr>
                                    <th>Current Responsible Division</th>
                                    <td>{{ data?.current_responsible_division.name }}</td>
                                </tr>
                                <tr>
                                    <th>Current Responsible Sub Division</th>
                                    <td>{{ data?.current_responsible_sub_divifany.name }}</td>
                                </tr>
                                <tr>
                                    <th>User Submitted</th>
                                    <td>{{ data?.user_submitted?.first_name + " " + data?.user_submitted?.last_name }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>

    </DefaultLayout>

</template>

<style></style>