<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { DivisionUrls } from '@/utils/apis'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { renderDateTime } from '@/utils/dateFormater';
import { useDivisionsStore } from '@/stores/departmentsStore';
import { useRoute } from 'vue-router'



interface divisionInterface {
  id: string;
  created_at: string;
  name: string;
  admin: any
}

interface divisionType {
    submitted_probs: number;
    submitted_probs_solved: number;
    submitted_probs_unsolved: number;
    sub_divisions:number;
    problem_types:number;
    division: divisionInterface;
}

const alertStore = useAlertStore();
const router = useRoute()
const divisionStore = useDivisionsStore();

const pageTitle = ref('Division Details');
const isLoading = ref(false);
const data = ref<divisionType>();

console.log();
onMounted(async () => {
    try {
        isLoading.value = true
        const ress = await divisionStore.getProblemType( DivisionUrls.divisionDetails + `?querytype=single&divisiId=${router.params.id}`);
        console.log(ress);
        data.value = ress;

        //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);


        // Further processing of division data if needed
    } catch (error) {
        console.error('Error fetching Division:', error)
        alertStore.addAlert({
            title: 'Error',
            message: 'Failed to fetch Division',
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
                                    {{ }} Division Details
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
                                    <td>{{ data?.division.id }}</td>
                                </tr>
                                <tr>
                                    <th>Division Name</th>
                                    <td>{{ data?.division.name }}</td>
                                </tr>
                                <tr>
                                    <th>Division Admin</th>
                                    <td>{{ data?.division.admin.first_name + " " + data?.division.admin.last_name}} </td>
                                </tr>
                                <tr>
                                    <th>Division Admin Phone</th>
                                    <td>{{ data?.division.admin.phone_number }}</td>
                                </tr>
                                <tr>
                                    <th>Created At</th>
                                    <td>{{ data?.division.created_at }}</td>
                                </tr>
                             
<!--                                
                                <template v-if="data?.problem_type?.responsible_sub_divifany?.name">
                                    <tr>
                                    <th>Current Responsible Sub Division</th>
                                    <td>{{ data?.problem_type?.responsible_sub_divifany.name }}</td>
                                </tr>
                                <tr>
                                    <th>Current Responsible Sub Division Phone</th>
                                    <td>{{ data?.problem_type?.responsible_sub_divifany.admin.phone_number }}</td>
                                </tr>
                                </template> -->
                                <tr>
                                    <th>Total no of Sub divisions</th>
                                    <td>{{ data?.sub_divisions }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Total Problems types assigned</th>
                                    <td>{{ data?.problem_types }}
                                    </td>
                                </tr>
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