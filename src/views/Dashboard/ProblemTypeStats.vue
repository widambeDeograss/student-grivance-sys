<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { problemsUrl } from '@/utils/apis'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { renderDateTime } from '@/utils/dateFormater';
import { useDivisionsStore } from '@/stores/departmentsStore';
import { useRoute } from 'vue-router'


interface problem {
  id: string
  created_at: string
  type_name: any
  responsible_division: any
  responsible_sub_divifany: any
  time_required: string
}

interface problemType {
    submitted_probs: any;
    submitted_probs_solved: string;
    submitted_probs_unsolved: boolean;
    problem_type: problem;
}

const alertStore = useAlertStore();
const router = useRoute()
const divisionStore = useDivisionsStore();

const pageTitle = ref('Grivace Details');
const isLoading = ref(false);
const data = ref<problemType>();

console.log();
onMounted(async () => {
    try {
        isLoading.value = true
        const ress = await divisionStore.getProblemType( problemsUrl.problemTypeDetails + `?querytype=single&probId=${router.params.id}`);
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
                                    Problem Type Details
                                </div>
                                <!-- <div class="p-1" v-if="">
                                    <ButtonDefault route="" label="SOLVE GRIVANCE"
                                        customClasses="bg-primary text-white text-xs rounded-lg -p-10">
                                        <span class="hidden sm:block">

                                        </span>
                                    </ButtonDefault>
                                </div> -->
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
                                    <td>{{ data?.problem_type.id }}</td>
                                </tr>
                                <tr>
                                    <th>Problem Type</th>
                                    <td>{{ data?.problem_type.type_name }}</td>
                                </tr>
                                <tr>
                                    <th>Time Required</th>
                                    <td>{{ data?.problem_type.time_required }} days h:m:s</td>
                                </tr>
                                <tr>
                                    <th>Responsible Division</th>
                                    <td>{{ data?.problem_type.responsible_division.name }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Division Phone</th>
                                    <td>{{ data?.problem_type.responsible_division.admin.phone_number }}</td>
                                </tr>
                                <tr>
                                    <th>Created At</th>
                                    <td>{{ data?.problem_type.created_at }}</td>
                                </tr>
                             
                               
                                <template v-if="data?.problem_type?.responsible_sub_divifany?.name">
                                    <tr>
                                    <th>Current Responsible Sub Division</th>
                                    <td>{{ data?.problem_type?.responsible_sub_divifany.name }}</td>
                                </tr>
                                <tr>
                                    <th>Current Responsible Sub Division Phone</th>
                                    <td>{{ data?.problem_type?.responsible_sub_divifany.admin.phone_number }}</td>
                                </tr>
                                </template>
                                <tr>
                                    <th>Total Problems Submitted</th>
                                    <td>{{ data?.submitted_probs }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Total Problems solved</th>
                                    <td>
                                        <p class="text-sm font-medium text-meta-3">
                                            {{data?.submitted_probs_solved}}
                                        </p>
            
                                    </td>
                                </tr>
                                <tr>
                                    <th>Total Problems unsolved</th>
                                    <td>
                                    
                                        <p class="text-sm font-medium text-meta-6"
                                           >
                                            {{data?.submitted_probs_unsolved}}
                                        </p>
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