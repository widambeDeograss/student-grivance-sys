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
  id: string;
  name: string;
  admin: string;
  type: string;
}
interface SubDivisions {
  id: string;
  name: string;
  admin: string;
  created_at: string;
}
interface ProblemType {
  id: string;
  type_name: string;
  time_required: string;
  created_at: string;
}

const alertStore = useAlertStore()
const divisionsStore = useDivisionsStore()
const authStore = useAuthStore()
const currentUser = authStore.currentUser;

const currentStep = ref(1)
const isLoading = ref(true)
const selectedDepartmentId = ref()
const selectedSubDepartmentId = ref()
const divisios = ref<Divisions[]>([]);
const subdivisions = ref<SubDivisions[]>([]);
const problemtypes = ref<ProblemType[]>([]);
const problemtype_selected = ref();
const selectedFile = ref(null)
const selectedFileType = ref('video');
const message = ref();

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

const handleDrop = event => {
  event.preventDefault()
  selectedFile.value = event.dataTransfer.files[0]
}

const handleFileChange = event => {
  selectedFile.value = event.target.files[0]
}

const submitFileForm = () => {
  // Check if file type matches selected file type
  if (selectedFile.value && selectedFile.value.type.includes(selectedFileType.value)) {
    // Submit the file
    console.log('File submitted successfully!')
    alertStore.addAlert({ title: 'Success', message: 'File submitted successfully!', duration: 3000, type: 'success' })

  } else {
    alertStore.addAlert({ title: 'Attention needed', message: 'Please select the correct file type', duration: 3000, type: 'warning' })

  }
}

const filterFileInput = () => {
  $refs.fileInput.value = ''
}
onMounted(async () => {
  try {
    // isLoading.value = true
    const res = await divisionsStore.getDivisions(DivisionUrls.allDivisions + `?querytype=all`);
    const ress = await authStore.getUserInfo(usersInfo.userInfo);
    //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);
    console.log(res);

    divisios.value = res;
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
  console.log(id);

  selectedDepartmentId.value = id;
  const res = await divisionsStore.getSubDivisions(DivisionUrls.subDivision + `?querytype=single&divisiId=${id}`);
  const ress = await divisionsStore.getProblemType(DivisionUrls.divProblemType + `?querytype=single&divisiId=${id}`);
  
  subdivisions.value = res
  problemtypes.value = ress

}

console.log(subdivisions.value);

const submitGrivance = async () =>  {
   if (!message.value && !selectedDepartmentId && !currentUser) {
    alertStore.addAlert({
      title: 'Grivance is required',
      message: 'Fill grivance before submitting',
      duration: 3000,
      type: 'warning'
    });
    return;
   }

   const body = {
    current_responsible_division:selectedDepartmentId.value,
    current_responsible_sub_divifany:selectedSubDepartmentId.value,
    submitted_problem:message.value,
    user_submitted:currentUser?.id,
    problem_type:problemtype_selected.value
   }

   console.log(body);
  
   try {
    const response = await axios.post(grivancesUrls.submitGrivance, body);
   console.log(response);
     
   if (response.status == 200) {
    alertStore.addAlert({
      title: 'Grivance submittes successful',
      message: '',
      duration: 3000,
      type: 'success'
    });
   }
   } catch (error) {
    alertStore.addAlert({
      title: 'Failed to submit Grivance',
      message: 'Check network and try agail later!',
      duration: 3000,
      type: 'warning'
    });
    
   }
   


}

</script>

<template>
  <div>
    <AlertWarning />
    <header class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Hamburger Toggle BTN -->
          <button
            class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"></button>
          <!-- Hamburger Toggle BTN -->
          <router-link class="block flex-shrink-0 text-black font-bold" to="/">
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
            <ButtonDefault route="/" label="SUBMIT GRIVANCE" customClasses="bg-primary text-white text-xs rounded-lg">
              <span>
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
          class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8">
          <div class="  pb-0 mb-0 border-b-0 rounded-t-2xl">
            <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6>
          </div>

          <div class="mt-6 ">
            <h6 class="mb-0 dark:text-white">SELECT DIVISION</h6>
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
              <div>
                <template v-for="(item, index) in divisios" :key="item.id">
                  <div class="  h-24 w-32  p-3 cursor-pointer text-center hover:scale-95 rounded-lg "
                    @click="SelectDivivison(item.id)"
                    :class="selectedDepartmentId == item.id ? 'bg-primary text-white' : 'bg-slate-300'">
                    <div class="items-center mt-6">
                      {{ item?.name }}
                    </div>
                  </div>
                </template>
              </div>
            </template>

          </div>
          <div class="mt-4 " v-if="subdivisions.length > 0">
            <h6 class="mb-0 dark:text-white">SELECT SUBDIVISION</h6>
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
              <div>
                <template v-for="(item, index) in subdivisions" :key="item.id">
                  <div class="  h-24 w-32  p-3 cursor-pointer text-center hover:scale-95 rounded-lg "
                    @click="selectedSubDepartmentId = item.id"
                    :class="selectedSubDepartmentId == item.id ? 'bg-primary text-white' : 'bg-slate-300'">
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
        <select v-model="problemtype_selected"
          class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
          <template v-for="(item, index) in problemtypes" :key="item?.id">
            <option :value="item.id">{{item?.type_name}}</option>
          </template>
          
        </select>
      </div>

          <div class="mb-6 mt-3">
            <label class="mb-2.5 block text-black dark:text-white"> Grivance </label>
            <textarea rows="6" placeholder="Type your grivance"
            required
            v-model="message"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
          </div>

          <div class="flex justify-between items-center">
            <button
            @click="submitGrivance"
              class="flex w- justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 sm:w-full lg:w-32 w-full">
              Submit Grivance
            </button>
            <button @click="nextStep"
              class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 float-right w-full text-center sm:w-full lg:w-32 ">Next
              step</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="currentStep === 2" class="bg-gray-200 p-4 rounded-lg">
      <div class="w-full max-w-full px-3 mt-6 md:flex-none">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8">
          <div class="  pb-0 mb-0 border-b-0 rounded-t-2xl">
            <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6>
          </div>
      <h2 class="text-lg font-bold mt-4">Step 2: Attach Evidence</h2>
      <h2 class="text-lg font-bold mb-4 mt-2">Problem Id:</h2>
      <div class="mb-4">
        <select v-model="selectedFileType"
          class="bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 w-full">
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div class="border-2 border-dashed border-gray-400 p-4 mb-4 rounded-lg" @dragover.prevent @drop="handleDrop">
        <p class="text-center mb-2">Drag and drop your file here or</p>
        <input type="file" @change="handleFileChange" ref="fileInput" :accept="acceptedFileType" class="hidden">
        <div v-if="selectedFile" class="mb-2 flex justify-center">
          File Selected: {{ selectedFile?.name }}
        </div>
        <div class=" flex justify-center">
          <button @click="$refs.fileInput?.click()"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Select
            File</button>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <button @click="prevStep" class="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600">Back</button>
        <button @click="submitForm" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<style></style>
