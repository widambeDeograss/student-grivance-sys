<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import { computed, onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/authStore'

import { grivancesUrls, usersInfo } from '@/utils/apis'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { renderDateTime } from '@/utils/dateFormater'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { baseUrl } from '@/utils/baseUrl'

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

interface evdType{
    id:string;
    problem:any;
    file_type:any;
    created:any;
    evdc:any;
    message:any;
}

const alertStore = useAlertStore()
const authStore = useAuthStore()
const router = useRoute()
const divisionStore = useDivisionsStore()

const pageTitle = ref('Grivace Details')
const isLoading = ref(false)
const isSolving = ref(false)
const isFormLoading = ref(false)
const attachFile = ref(false)
const data = ref<grivanceType>()
const message = ref()
const selectedFile = ref(null)
const selectedFileType = ref('video')
const solnFiles = ref<evdType[]>([])
const evdFiles = ref<evdType[]>([])
const viewEvd = ref(false);
const viewSoln = ref(false);

const loadGrivance = async () => {
  try {
    isLoading.value = true
    const ress = await divisionStore.getProblemType(
      grivancesUrls.submitGrivance + `?querytype=single_prob&id=${router.params.id}`
    )
    console.log(ress)
    data.value = ress

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
}
onMounted(async () => {
  loadGrivance()
})

const acceptedFileType = computed(() => {
  if (selectedFileType.value === 'image' || selectedFileType.value === 'pdf') {
    return selectedFileType.value + '/*'
  } else {
    return selectedFileType.value === 'pdf' ? 'application/pdf' : selectedFileType.value + '/*'
  }
})

const handleDrop = (event: any) => {
  event.preventDefault()
  selectedFile.value = event.dataTransfer.files[0]
}

const handleFileChange = (event: any) => {
  selectedFile.value = event.target.files[0]
}

const submitForm = async () => {
  // Check if file type matches selected file type
  const isFileSelected =
    selectedFile.value && selectedFile?.value?.type.includes(selectedFileType.value)

  if (message.value || isFileSelected) {
    if (!message.value) {
      alertStore.addAlert({
        title: 'Attention needed',
        message: 'Please write a soln first',
        duration: 3000,
        type: 'warning'
      })
      return
    }
    isFormLoading.value = true
    const formData = new FormData()
    const file_type =
      selectedFileType.value === 'audio'
        ? '1'
        : selectedFileType.value === 'vedio'
          ? '2'
          : selectedFileType.value === 'image'
            ? '3'
            : '4'
    formData.append('file_type', file_type)
    isFileSelected ? formData.append('evdc', selectedFile.value) : null
    formData.append('problem', router?.params.id)
    formData.append('message', message.value)
    data.value?.user_submitted? formData.append('user', data.value?.user_submitted.id):formData.append('user',"")

    try {
      const response = await axios.post(
        grivancesUrls.submitGrivanceEvidence + `?prob_id=${router.params.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response)

      if (response?.data?.save) {
        alertStore.addAlert({
          title: 'Grivance  solution submitted successfully',
          message: 'File submitted successfully!',
          duration: 3000,
          type: 'success'
        })
        isFormLoading.value = false
        loadGrivance()
        isSolving.value = false
      } else {
        alertStore.addAlert({
          title: 'Failed to submit Grivance solution',
          message: 'Check network and try agail later!',
          duration: 3000,
          type: 'error'
        })
      }
      isFormLoading.value = false
    } catch (error) {
      console.log(error)

      alertStore.addAlert({
        title: 'Failed to submit Grivance solution',
        message: 'Check network and try agail later!',
        duration: 3000,
        type: 'error'
      })
      isFormLoading.value = false
    }
  } else {
    alertStore.addAlert({
      title: 'Attention needed',
      message: 'Please select the correct file type or write a soln',
      duration: 3000,
      type: 'warning'
    })
  }
}

const filterFileInput = () => {
  $refs.fileInput.value = ''
}

const getEvidence = async () => {
    viewEvd.value = true;
  try {
    const response = await divisionStore.getProblemType(
      grivancesUrls.submitGrivanceEvidence + `?querytype=single&prob_id=${router.params.id}`
    )
    console.log(response)
    const evdc = response?.filter((evd:evdType) =>  evd.message == null);
    const slns = response?.filter((evd:evdType) => evd.message !== null);
    
    solnFiles.value = slns;
    evdFiles.value = evdc;

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
const toPdf = (link:string) => {
    console.log(link);
    
    window.open(link, "_blank");
} 
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="card p-3">
        <div class="card-body">
          <div class="table-top">
            <div class="search-set">
              <div class="flex justify-between items-center">
                <div class="p-3">Grivace Details</div>
                <div class="p-1" v-if="!data?.problem_solved_state" @click="isSolving = true">
                  <ButtonDefault
                    route=""
                    label="SOLVE GRIVANCE"
                    customClasses="bg-primary text-white text-xs rounded-lg -p-10"
                  >
                    <span class="hidden sm:block"> </span>
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
                    <p
                      class="text-sm font-medium text-meta-6"
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
                <tr>
                  <th>Responsible Division</th>
                  <td>{{ data?.problem_type.responsible_division.name }}</td>
                </tr>
                <!-- <tr>
                                    <th>Responsible Sub Division</th>
                                    <td>{{ data?.problem_type.responsible_sub_divifany.name }}</td>
                                </tr> -->
                <tr>
                  <th>Current Responsible Division</th>
                  <td>{{ data?.current_responsible_division.name }}</td>
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

             
      <div class="flex flex-row gap-3 mt-3 mb-2 ">
            <div
              class="border-[0.4px] w-fit p-2 rounded-lg hover:border-blue-500 cursor-pointer hover:shadow-1 "
              @click="getEvidence"
            >
              View Evidence Files
            </div>
          <div
          @click="viewSoln=true"
          >
            <div
              class="border-[0.4px] w-fit p-2 rounded-lg hover:border-blue-500 cursor-pointer hover:shadow-1"
              v-if="data?.problem_solved_state"
              @click="getEvidence"
            >
              View Solution Files
            </div>
          </div>

           
          </div>

          <div class="mt-3 "  v-if="viewEvd">
                <p class="text-base">Problem evidence files</p>
                <div v-if="evdFiles.length === 0" class="text-xs mt-4">No evidence files for this grivance</div>
                 <div class="flex flex-wrap lg:flex-row gap-8 sm:flex-wrap justify-start lg:justify-start sm:justify-center">
                    <template v-for="(item, index) in evdFiles" :key="index">
                        <div v-if="item.file_type == 3">
                        <img :src="baseUrl + item.evdc" alt="" srcset="" class="w-44 h-39 rounded-lg mt-2">
                     
                         image
                    </div>
                        <div v-if="item.file_type == 4"
                        @click="toPdf(`${baseUrl}${item.evdc}`)"
                        >
                        <img src="../../assets/images/pdf_view.png" alt="" srcset="" class="w-44 h-39 rounded-lg mt-2 cursor-pointer"
                       
                        >
                        Click to open Pdf
                    </div>
                    <div v-if="item.file_type == 1">
                        <video
                        class="w-44 h-39 rounded-lg mt-2"
                      controls
                      autoPlay
                      muted
                    >
                      <source
                      :src="baseUrl + item.evdc"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                         Video
                    </div>
                  
                </template>
                 </div>
            </div>

            
          <div class="mt-3 " v-if="viewSoln">
                <p class="text-base">Problem solution files</p>
                <div v-if="solnFiles.length === 0" class="text-xs mt-2">No Solution files for this grivance</div>
                <div class="flex flex-wrap lg:flex-row gap-8 sm:flex-wrap justify-start lg:justify-start sm:justify-center">
                <template v-for="(item, index) in solnFiles" :key="index">
                    <div v-if="item.file_type == 3">
                        <img :src="baseUrl + item.evdc" alt="" srcset="" class="w-44 h-39 rounded-lg mt-2">
                       
                         image
                    </div>
                        <div v-if="item.file_type == 4"
                        @click="toPdf(`${baseUrl}${item.evdc}`)"
                        >
                        <img src="../../assets/images/pdf_view.png" alt="" srcset="" class="w-44 h-39 rounded-lg mt-2 cursor-pointer"
                       
                        >
                        Click to open Pdf
                    </div>
                    <div v-if="item.file_type == 1">
                        <video
                        class="w-44 h-39 rounded-lg mt-2"
                      controls
                      autoPlay
                      muted
                    >
                      <source
                      :src="baseUrl + item.evdc"
                        type="video/mp4"
                      />
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

    <template v-if="isSolving">
      <div
        class="rounded-sm border mt-3 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5"
      >
        <div class="pb-0 mb-0 border-b-0 rounded-t-2xl">
          <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SOLUTION FORM</h6>
        </div>

        <div class="mb-6 mt-3">
          <label class="mb-2.5 block text-black dark:text-white"> Solution </label>
          <textarea
            rows="6"
            placeholder="Soln Explanation"
            required
            v-model="message"
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>
        </div>

        <div
          class="border-[0.4px] w-fit p-2 rounded-lg hover:border-blue-500 cursor-pointer hover:shadow-1"
          v-if="!attachFile"
          @click="attachFile = true"
        >
          Attach File
        </div>

        <template v-if="attachFile">
          <div class="w-full max-w-full px-3 mt-6 md:flex-none">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8"
            >
              <h2 class="text-lg font-bold mt-4">Step 2: Attach solution file</h2>
              <div class="mb-4">
                <select
                  v-model="selectedFileType"
                  class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
                >
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div
                class="border-2 border-dashed border-gray-400 p-4 mb-4 rounded-lg"
                @dragover.prevent
                @drop="handleDrop"
              >
                <p class="text-center mb-2">Drag and drop your file here or</p>
                <input
                  type="file"
                  @change="handleFileChange"
                  ref="fileInput"
                  :accept="acceptedFileType"
                  class="hidden"
                />
                <div v-if="selectedFile" class="mb-2 flex justify-center">
                  File Selected: {{ selectedFile?.name }}
                </div>
                <div class="flex justify-center">
                  <button
                    @click="$refs.fileInput.click()"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Select File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="flex justify-between items-center mt-5">
          <template v-if="isFormLoading">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submiting......
            </button>
          </template>
          <template v-else>
            <button
              @click="submitForm"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </template>
        </div>
        
      </div>
    </template>

  </DefaultLayout>
</template>

<style></style>
