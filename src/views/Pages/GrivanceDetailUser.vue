<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { useAuthStore } from '@/stores/authStore'
import { renderDateTime } from '@/utils/dateFormater'
import { useRoute } from 'vue-router'
import DropdownNotification from '@/components/Header/DropdownNotification.vue'
import DropdownUser from '@/components/Header/DropdownUser.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { usersInfo, grivancesUrls } from '@/utils/apis'
import { baseUrl } from '@/utils/baseUrl'
import { useAlertStore } from '@/stores/alert'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { onMounted, ref } from 'vue'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'

interface grivanceType {
  id: string
  created_at: string
  current_responsible_division: any
  current_responsible_sub_divifany: any
  problem_type: any
  responsible_division: any
  responsible_sub_divifany: any
  submitted_problem: string
  problem_solved_state: boolean
  user_submitted: any
}

interface evdType {
  id: string
  problem: any
  file_type: any
  created: any
  evdc: any
  message: any
}

const alertStore = useAlertStore()
const authStore = useAuthStore()
const router = useRoute()
const divisionStore = useDivisionsStore()

const pageTitle = ref('Grivace Details')
const isLoading = ref(false)
const data = ref<grivanceType>()
const solnFiles = ref<evdType[]>([])
const evdFiles = ref<evdType[]>([])
const viewEvd = ref(false)
const viewSoln = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const ress = await divisionStore.getProblemType(
      grivancesUrls.submitGrivance + `?querytype=single_prob&id=${router.params.id}`
    )
    data.value = ress
    console.log(ress)

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
})

const getEvidence = async () => {
  viewEvd.value = true
  try {
    const response = await divisionStore.getProblemType(
      grivancesUrls.submitGrivanceEvidence + `?querytype=single&prob_id=${router.params.id}`
    )
    console.log(response)
    const evdc = response?.filter((evd: evdType) => evd.message == null)
    const slns = response?.filter((evd: evdType) => evd.message !== null)

    solnFiles.value = slns
    evdFiles.value = evdc
  } catch (error) {
    console.log(error)

    alertStore.addAlert({
      title: 'Failed to get files',
      message: 'There is no files for this Grivance',
      duration: 3000,
      type: 'warning'
    })
  }
}
const toPdf = (link: string) => {
  console.log(link)

  window.open(link, '_blank')
}
</script>

<template>
  <AlertWarning />
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Hamburger Toggle BTN -->
        <button
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
        ></button>
        <!-- Hamburger Toggle BTN -->
        <router-link class="block flex-shrink-0 text-black font-bold" to="/grivances">
          DIT GRIVANCE SUBMISSION
        </router-link>
      </div>
      <div class="hidden sm:block">
        <form action="https://formbold.com/s/unique_form_id" method="POST">
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
              placeholder="Type to search..."
              class="w-full xl:w-125 bg-transparent pr-4 pl-9 focus:outline-none"
            />
          </div>
        </form>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <ButtonDefault
            route="/grivances/submission"
            label="SUBMIT GRIVANCE"
            customClasses="bg-primary text-white text-xs rounded-lg -p-10"
          >
            <span class="hidden sm:block">
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.8125 16.6656H2.1875C1.69022 16.6656 1.21331 16.4681 0.861675 16.1164C0.510044 15.7648 0.3125 15.2879 0.3125 14.7906V5.20935C0.3125 4.71207 0.510044 4.23516 0.861675 3.88353C1.21331 3.53189 1.69022 3.33435 2.1875 3.33435H17.8125C18.3098 3.33435 18.7867 3.53189 19.1383 3.88353C19.49 4.23516 19.6875 4.71207 19.6875 5.20935V14.7906C19.6875 15.2879 19.49 15.7648 19.1383 16.1164C18.7867 16.4681 18.3098 16.6656 17.8125 16.6656ZM2.1875 4.58435C2.02174 4.58435 1.86277 4.6502 1.74556 4.76741C1.62835 4.88462 1.5625 5.04359 1.5625 5.20935V14.7906C1.5625 14.9564 1.62835 15.1153 1.74556 15.2325C1.86277 15.3498 2.02174 15.4156 2.1875 15.4156H17.8125C17.9783 15.4156 18.1372 15.3498 18.2544 15.2325C18.3717 15.1153 18.4375 14.9564 18.4375 14.7906V5.20935C18.4375 5.04359 18.3717 4.88462 18.2544 4.76741C18.1372 4.6502 17.9783 4.58435 17.8125 4.58435H2.1875Z"
                  fill=""
                />
                <path
                  d="M9.9996 10.6438C9.63227 10.6437 9.2721 10.5421 8.95898 10.35L0.887102 5.45001C0.744548 5.36381 0.642073 5.22452 0.602222 5.06277C0.58249 4.98268 0.578725 4.89948 0.591144 4.81794C0.603563 4.73639 0.631922 4.65809 0.674602 4.58751C0.717281 4.51692 0.773446 4.45543 0.839888 4.40655C0.906331 4.35767 0.981751 4.32236 1.06184 4.30263C1.22359 4.26277 1.39455 4.28881 1.5371 4.37501L9.60898 9.28126C9.7271 9.35331 9.8628 9.39143 10.0012 9.39143C10.1395 9.39143 10.2752 9.35331 10.3934 9.28126L18.4621 4.37501C18.5323 4.33233 18.6102 4.30389 18.6913 4.29131C18.7725 4.27873 18.8554 4.28227 18.9352 4.30171C19.015 4.32115 19.0901 4.35612 19.1564 4.40462C19.2227 4.45312 19.2788 4.51421 19.3215 4.58438C19.3642 4.65456 19.3926 4.73245 19.4052 4.81362C19.4177 4.89478 19.4142 4.97763 19.3948 5.05743C19.3753 5.13723 19.3404 5.21242 19.2919 5.27871C19.2434 5.34499 19.1823 5.40108 19.1121 5.44376L11.0402 10.35C10.7271 10.5421 10.3669 10.6437 9.9996 10.6438Z"
                  fill=""
                />
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
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-5 mx-5"
  >
    <div class="card p-3">
      <div class="card-body">
        <div class="table-top">
          <div class="search-set">
            <div class="flex justify-between items-center">
              <div class="text-lg font-bold py-5">Grivace Details</div>
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
                  <p
                    class="text-sm font-medium text-meta-3 animate-pulse"
                    v-if="data?.problem_solved_state"
                  >
                    Solved
                  </p>
                  <p
                    class="text-sm font-medium text-meta-6 animate-pulse"
                    v-else-if="!data?.problem_solved_state"
                  >
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
              <!-- <tr>
                                    <th>Responsible Division</th>
                                    <td>{{ data?.problem_type.responsible_division.name }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Division Phone</th>
                                    <td>{{ data?.problem_type.responsible_division.admin.phone_number }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Sub Division</th>
                                    <td>{{ data?.problem_type.responsible_sub_divifany.name }}</td>
                                </tr>
                                <tr>
                                    <th>Responsible Sub Division Phone</th>
                                    <td>{{ data?.problem_type.responsible_sub_divifany.admin.phone_number }}</td>
                                </tr> -->
              <tr>
                <th>Current Responsible Division</th>
                <td>{{ data?.current_responsible_division.name }}</td>
              </tr>
              <tr>
                <th>Current Responsible Division Phone</th>
                <td>{{ data?.current_responsible_division.admin.phone_number }}</td>
              </tr>
              <template v-if="data?.current_responsible_sub_divifany?.name">
                <tr>
                  <th>Current Responsible Sub Division</th>
                  <td>{{ data?.current_responsible_sub_divifany.name }}</td>
                </tr>
                <tr>
                  <th>Current Responsible Sub Division Phone</th>
                  <td>{{ data?.current_responsible_sub_divifany.admin.phone_number }}</td>
                </tr>
              </template>

              <tr>
                <th>User Submitted</th>
                <td>
                  {{ data?.user_submitted?.first_name + ' ' + data?.user_submitted?.last_name }}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex flex-row gap-3">
            <div
              class="border-[0.4px] w-fit p-2 rounded-lg hover:border-blue-500 cursor-pointer hover:shadow-1 mt-5"
              @click="getEvidence"
            >
              View Evidence Files
            </div>
            <div @click="viewSoln = true">
              <div
                class="border-[0.4px] w-fit p-2 rounded-lg hover:border-blue-500 cursor-pointer hover:shadow-1 mt-5"
                v-if="data?.problem_solved_state"
                @click="getEvidence"
              >
                View Solution Files
              </div>
            </div>
          </div>
          <div class="mt-3" v-if="viewEvd">
            <p class="text-base">Problem evidence files</p>
            <div v-if="evdFiles.length === 0" class="text-xs mt-4">
              No evidence files for this grivance
            </div>
            <div
              class="flex flex-wrap lg:flex-row gap-8 sm:flex-wrap justify-start lg:justify-start sm:justify-center"
            >
              <template v-for="(item, index) in evdFiles" :key="index">
                <div v-if="item.file_type == 3">
                  <img
                    :src="baseUrl + item.evdc"
                    alt=""
                    srcset=""
                    class="w-44 h-39 rounded-lg mt-2"
                  />
                  {{ item.file_type }}
                  image
                </div>
                <div v-if="item.file_type == 4" @click="toPdf(`${baseUrl}${item.evdc}`)">
                  <img
                    src="../../assets/images/pdf_view.png"
                    alt=""
                    srcset=""
                    class="w-44 h-39 rounded-lg mt-2 cursor-pointer"
                  />
                  Click to open Pdf
                </div>
                <div v-if="item.file_type == 1">
                  <video class="w-44 h-39 rounded-lg mt-2" controls autoPlay muted>
                    <source :src="baseUrl + item.evdc" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  Video
                </div>
              </template>
            </div>
          </div>

          <div class="mt-3" v-if="viewSoln">
            <p class="text-base">Problem solution files</p>
            <div v-if="solnFiles.length === 0" class="text-xs mt-2">
              No Solution files for this grivance
            </div>
            <div
              class="flex flex-wrap lg:flex-row gap-8 sm:flex-wrap justify-start lg:justify-start sm:justify-center"
            >
              <template v-for="(item, index) in solnFiles" :key="index">
                <div v-if="item.file_type == 3">
                  <img
                    :src="baseUrl + item.evdc"
                    alt=""
                    srcset=""
                    class="w-44 h-39 rounded-lg mt-2"
                  />
                  {{ item.file_type }}
                  image
                </div>
                <div v-if="item.file_type == 4" @click="toPdf(`${baseUrl}${item.evdc}`)">
                  <img
                    src="../../assets/images/pdf_view.png"
                    alt=""
                    srcset=""
                    class="w-44 h-39 rounded-lg mt-2 cursor-pointer"
                  />
                  Click to open Pdf
                </div>
                <div v-if="item.file_type == 1">
                  <video class="w-44 h-39 rounded-lg mt-2" controls autoPlay muted>
                    <source :src="baseUrl + item.evdc" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  Video
                </div>
                <div class="mt-5">
                  <span class="font-bold">Solution:</span>
                  {{ item.message }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
