<script setup lang="ts">
import DropdownNotification from '@/components/Header/DropdownNotification.vue'
import DropdownUser from '@/components/Header/DropdownUser.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { ref, computed, onMounted } from 'vue'
import { useAlertStore } from '@/stores/alert'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'
import SelectGroupTwo from '@/components/Forms/SelectGroup/SelectGroupTwo.vue'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { DivisionUrls, usersInfo, grivancesUrls } from '@/utils/apis'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface Divisions {
  id: string
  name: string
  admin: string
  type: string
}

interface SubDivisions {
  id: string
  name: string
  admin: string
  created_at: string
}

interface ProblemType {
  id: string
  type_name: string
  time_required: string
  created_at: string
}

const alertStore = useAlertStore()
const divisionsStore = useDivisionsStore()
const authStore = useAuthStore()
const currentUser = authStore.currentUser
const currentStep = ref(1)
const isLoading = ref(true)
const selectedDepartmentId = ref()
const selectedSubDepartmentId = ref()
const divisios = ref<Divisions[]>([])
const subdivisions = ref<SubDivisions[]>([])
const problemtypes = ref<ProblemType[]>([])
const problemtype_selected = ref()
const selectedFile = ref(null)
const selectedFileType = ref('video')
const message = ref()
const isFormLoading = ref(false)
const saved_problem = ref()

const acceptedFileType = computed(() => {
  if (selectedFileType.value === 'image' || selectedFileType.value === 'pdf') {
    return selectedFileType.value + '/*'
  } else {
    return selectedFileType.value === 'pdf' ? 'application/pdf' : selectedFileType.value + '/*'
  }
})

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const handleDrop = (event) => {
  event.preventDefault()
  selectedFile.value = event.dataTransfer.files[0]
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const submitForm = async () => {
  // Check if file type matches selected file type
  if (
    selectedFile.value &&
    selectedFile?.value?.type.includes(selectedFileType.value) &&
    saved_problem
  ) {
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
    formData.append(
      'current_responsible_division',
      saved_problem.value?.current_responsible_division
    )
    formData.append('submitted_problem', saved_problem.value?.submitted_problem)
    formData.append('problem_type', saved_problem.value?.problem_type)
    formData.append('file_type', file_type)
    formData.append('evdc', selectedFile.value)
    formData.append('type_submission', 'problem_evd')

    try {
      const response = await axios.post(grivancesUrls.submitGrivanceEvidence, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response)

      if (response?.data?.save) {
        alertStore.addAlert({
          title: 'Grivance evidence submitted successfully',
          message: 'File submitted successfully!',
          duration: 3000,
          type: 'success'
        })
      } else {
        alertStore.addAlert({
          title: 'Failed to submit Grivance Evidence',
          message: 'Check network and try agail later!',
          duration: 3000,
          type: 'warning'
        })
      }
      isFormLoading.value = false
    } catch (error) {
      console.log(error)

      alertStore.addAlert({
        title: 'Failed to submit Grivance',
        message: 'Check network and try agail later!',
        duration: 3000,
        type: 'warning'
      })
      isFormLoading.value = false
    }
  } else {
    alertStore.addAlert({
      title: 'Attention needed',
      message: 'Please select the correct file type',
      duration: 3000,
      type: 'warning'
    })
  }
}

const filterFileInput = () => {
  $refs.fileInput.value = ''
}

onMounted(async () => {
  try {
    // isLoading.value = true
    const res = await divisionsStore.getDivisions(DivisionUrls.allDivisions + `?querytype=all`)
    const ress = await authStore.getUserInfo(usersInfo.userInfo)
    //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);
    console.log(res)

    divisios.value = res?.filter((div: Divisions) => div.name !== 'Responsible Top Division')
    // Further processing of division data if needed
  } catch (error) {
    console.error('Error fetching divisions:', error)
    alertStore.addAlert({
      title: 'Error',
      message: 'Failed to fetch divisions',
      duration: 3000,
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
})
const SelectDivivison = async (id: any) => {
  console.log(id)

  selectedDepartmentId.value = id
  const res = await divisionsStore.getSubDivisions(
    DivisionUrls.subDivision + `?querytype=single&divisiId=${id}`
  )
  const ress = await divisionsStore.getProblemType(
    DivisionUrls.divProblemType + `?querytype=signle_div_problems&divisiId=${id}`
  )

  subdivisions.value = res
  problemtypes.value = ress
}

console.log(subdivisions.value)

const submitGrivance = async () => {
  if (!message.value && !selectedDepartmentId && !currentUser) {
    alertStore.addAlert({
      title: 'Grivance is required',
      message: 'Fill grivance before submitting',
      duration: 3000,
      type: 'warning'
    })
    return
  }

  const body = {
    current_responsible_division: selectedDepartmentId.value,
    current_responsible_sub_divifany: selectedSubDepartmentId.value,
    submitted_problem: message.value,
    user_submitted: currentUser?.id,
    problem_type: problemtype_selected.value
  }

  console.log(body)

  try {
    const response = await axios.post(grivancesUrls.submitGrivance, body)
    console.log(response)

    if (response.status == 200) {
      alertStore.addAlert({
        title: 'Grivance submittes successful',
        message: `${message.value?.substring(0, 30)}...`,
        duration: 3000,
        type: 'success'
      })
      message.value = ''
      problemtype_selected.value = ''
      selectedSubDepartmentId.value = ''
      selectedDepartmentId.value = ''

      saved_problem.value = response?.data?.saved_problem
    }
  } catch (error) {
    alertStore.addAlert({
      title: 'Failed to submit Grivance',
      message: 'Check network and try agail later!',
      duration: 3000,
      type: 'warning'
    })
  }
}

</script>

<template>
  <div>
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

        <div class="flex items-center gap-3 2xsm:gap-7">
          <ul class="flex items-center gap-2 2xsm:gap-4">
            <!-- Notification Menu Area -->
            <DropdownNotification />
            <!-- Notification Menu Area -->
          </ul>

          <!-- User Area -->
          <DropdownUser />
          <!-- User Area -->
        </div>
      </div>
    </header>
    <div v-if="currentStep === 1" class="bg-gray-200 p-4 rounded-lg">
      <div class="w-full max-w-full px-3 mt-6 md:flex-none">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl  bg-clip-border p-8"
        >
          <div class="pb-0 mb-0 border-b-0 rounded-t-2xl">
            <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6>
            <h2 class="text-lg font-bold mt-4">Step 1: Submit your grievance</h2>
          </div>

          <div class="mt-6">
            <h6 class="mb-0 dark:text-white">SELECT DIVISION</h6>
            <template v-if="isLoading">
              <div class="flex flex-wrap justify-start items-center gap-6 w-full mt-3">
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
              </div>
            </template>
            <template v-else>
              <div
                class="flex flex-wrap gap-5 justify-center items-center lg:justify-start sm:justify-center"
              >
                <template v-for="(item, index) in divisios" :key="item.id">
                  <div
                    class="h-24 w-32 p-3 cursor-pointer text-center hover:scale-95 rounded-lg"
                    @click="SelectDivivison(item.id)"
                    :class="
                      selectedDepartmentId == item.id ? 'bg-primary text-white' : 'bg-slate-300'
                    "
                  >
                    <div class="items-center mt-6">
                      {{ item?.name }}
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <div class="mt-4" v-if="subdivisions.length > 0">
            <h6 class="mb-0 dark:text-white">SELECT SUBDIVISION</h6>
            <template v-if="isLoading">
              <div class="flex flex-wrap justify-start items-center gap-6 w-full mt-3">
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
                <div class="animate-pulse bg-slate-300 h-24 w-32 rounded-lg"></div>
              </div>
            </template>
            <template v-else>
              <div>
                <template v-for="(item, index) in subdivisions" :key="item.id">
                  <div
                    class="h-24 w-32 p-3 cursor-pointer text-center hover:scale-95 rounded-lg"
                    @click="selectedSubDepartmentId = item.id"
                    :class="
                      selectedSubDepartmentId == item.id ? 'bg-primary text-white' : 'bg-slate-300'
                    "
                  >
                    <div class="items-center mt-3">
                      {{ item?.name }}
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>

          <div class="mb-6 mt-3" v-if="selectedDepartmentId">
            <label class="mb-2.5 block text-black dark:text-white"> Select problem type </label>
            <select
              v-model="problemtype_selected"
              class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            >
              <template v-for="(item, index) in problemtypes" :key="item?.id">
                <option :value="item.id">{{ item?.type_name }}</option>
              </template>
            </select>
          </div>

          <div class="mb-6 mt-3">
            <label class="mb-2.5 block text-black dark:text-white"> Grivance </label>
            <textarea
              rows="6"
              placeholder="Type your grivance"
              required
              v-model="message"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <div class="flex justify-between items-center">
            <button
              @click="submitGrivance"
              class="flex w- justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 sm:w-full lg:w-32 w-full"
            >
              Submit
            </button>
          
          </div>
        </div>
  
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl  bg-clip-border p-8"
        >
         
          <h2 class="text-lg font-bold mt-4">Step 2: Attach Evidence</h2>
          <h2 class="text-lg font-bold mb-4 mt-2">Problem:{{ message}}</h2>
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
                @click="$refs.fileInput?.click()"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Select File
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center">
           
            <template v-if="isFormLoading">
              <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submiting......
              </button>
            </template>
            <template v-else>
              <button
                @click="submitForm"
                class="bg-primary  text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
