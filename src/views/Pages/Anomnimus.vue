<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAlertStore } from '@/stores/alert'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'
import SelectGroupTwo from '@/components/Forms/SelectGroup/SelectGroupTwo.vue'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { DivisionUrls, grivancesUrls } from '@/utils/apis'
import axios from 'axios'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Stepper',
  components: {
    AlertWarning,
    SelectGroupTwo
  },
  setup() {
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

    const currentStep = ref(1)
    const selectedFile = ref(null)
    const selectedFileType = ref('video');
    const isLoading = ref(false)
    const selectedDepartmentId = ref()
    const selectedSubDepartmentId = ref()

    const divisios = ref<Divisions[]>([])
    const subdivisions = ref<SubDivisions[]>([])
    const problemtypes = ref<ProblemType[]>([])
    const problemtype_selected = ref()
    const saved_problem = ref()
    const message = ref<string>()
    const isFormLoading = ref(false)

    console.log(divisios)

    const acceptedFileType = computed(() => {
      if (selectedFileType.value === 'image' || selectedFileType.value === 'pdf') {
        return selectedFileType.value + '/*'
      } else {
        return selectedFileType.value === 'pdf' ? 'application/pdf' : selectedFileType.value + '/*'
      }
    })
    onMounted(async () => {
      try {
        const res = await divisionsStore.getDivisions(DivisionUrls.allDivisions + `?querytype=all`)
        //  const res =  await axios.get(DivisionUrls.allDivisions + `?querytype=all`);
        console.log(res)

        divisios.value = res?.filter((div: Divisions) => div.name !== 'Responsible Top Division')
      } catch (error) {
        console.error('Error fetching divisions:', error)
        alertStore.addAlert({
          title: 'Error',
          message: 'Failed to fetch divisions',
          duration: 3000,
          type: 'error'
        })
      }
    })

    const SelectDivivison = async (id: any) => {
      console.log(id)

      selectedDepartmentId.value = id
      const res = await divisionsStore.getSubDivisions(
        DivisionUrls.subDivision + `?querytype=single&divisiId=${id}`
      )
      const ress = await divisionsStore.getProblemType(
        DivisionUrls.divProblemType +`?querytype=signle_div_problems&divisiId=${id}`
      )

      subdivisions.value = res
      problemtypes.value = ress
    }

    const submitGrivance = async () => {
      if (!message.value && !selectedDepartmentId) {
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
        current_responsible_sub_divifany: selectedSubDepartmentId.value
          ? selectedSubDepartmentId.value
          : null,
        submitted_problem: message.value,
        problem_type: problemtype_selected.value
      }

      console.log(body)

      try {
        const response = await axios.post(
          grivancesUrls.submitGrivance + `?querytype=anonymous`,
          body
        )
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

    const nextStep = () => {
      currentStep.value++
    }

    const prevStep = () => {
      currentStep.value--
    }

    const handleDrop = (event: any) => {
      event.preventDefault()
      selectedFile.value = event.dataTransfer.files[0]
    }

    const handleFileChange = (event: any) => {
      selectedFile.value = event.target.files[0]
    }

    const submitForm = async () => {
      // Check if file type matches selected file type
      if (
        selectedFile.value &&
        selectedFile?.value?.type.includes(selectedFileType.value) &&
        saved_problem
      ) {
        
        isFormLoading.value = true;
        const formData = new FormData()
        const file_type = selectedFileType.value === "audio"?'1' :selectedFileType.value === "vedio"? '2':selectedFileType.value === "image"? '3':'4';
        formData.append(
          'current_responsible_division',
          saved_problem.value?.current_responsible_division
        )
        formData.append('submitted_problem', saved_problem.value?.submitted_problem)
        formData.append('problem_type', saved_problem.value?.problem_type)
        formData.append('file_type', file_type)
        formData.append('evdc', selectedFile.value)
        formData.append('type_submission', 'problem_evd')
        console.log(formData)

        try {
          const response = await axios.post(grivancesUrls.submitGrivanceEvidence, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          console.log(response);
          

          if (response?.data?.save) {
            alertStore.addAlert({
              title: 'Grivance evidence submitted successfully',
              message: 'File submitted successfully!',
              duration: 3000,
              type: 'success'
            })
            isFormLoading.value = false;
          }
        } catch (error) {
          console.log(error)

          alertStore.addAlert({
            title: 'Failed to submit Grivance',
            message: 'Check network and try agail later!',
            duration: 3000,
            type: 'warning'
          })
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

    return {
      divisios,
      currentStep,
      selectedFile,
      selectedFileType,
      acceptedFileType,
      nextStep,
      prevStep,
      handleDrop,
      handleFileChange,
      submitForm,
      filterFileInput,
      subdivisions,
      problemtypes,
      SelectDivivison,
      selectedDepartmentId,
      selectedSubDepartmentId,
      isLoading,
      message,
      submitGrivance,
      problemtype_selected,
      saved_problem,
      isFormLoading
    }
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
            @click="
              () => {
                console.log('Toggling Sidebar')
              }
            "
          ></button>
          <!-- Hamburger Toggle BTN -->
          <router-link class="block flex-shrink-0 text-black font-bold" to="/">
            DIT GRIVANCE SUBMISSION
          </router-link>
        </div>

        <div class="flex items-center gap-3 2xsm:gap-7">
          <ul class="flex items-center gap-2 2xsm:gap-4">
            <router-link to="/anomnimus/login">
              <li class="flex p-3 hover:shadow-4 hover:bg-primary hover:text-white">
                <svg
                  class="fill-current mt-1 mr-1"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_130_9814)">
                    <path
                      d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                      fill=""
                    />
                    <path
                      d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                      fill=""
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_130_9814">
                      <rect width="18" height="18" fill="white" transform="translate(0 0.052124)" />
                    </clipPath>
                  </defs>
                </svg>

                <a href="#about" class="font-bold" data-nav-link>Log in</a>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
    </header>

    <div class="flex flex-col gap-9">
      <!-- Contact Form Start -->
      <div class="p-4">
        <h2 class="text-lg font-bold mb-1 px-10">
          Take two steps to submit your grivance Anomnymusly
        </h2>
        <div v-if="currentStep === 1" class="bg-gray-200 p-4 rounded-lg">
          <div class="w-full max-w-full px-3 mt-6 md:flex-none">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8"
            >
              <div class="pb-0 mb-0 border-b-0 rounded-t-2xl">
                <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6>
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
                  <div class="flex flex-wrap gap-5 justify-center items-center lg:justify-start sm:justify-center">
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
                          selectedSubDepartmentId == item.id
                            ? 'bg-primary text-white'
                            : 'bg-slate-300'
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
                <button
                  @click="nextStep"
                  class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 float-right w-full text-center sm:w-full lg:w-32"
                >
                  Next step
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentStep === 2" class="bg-gray-200 p-4 rounded-lg">
          <div class="w-full max-w-full px-3 mt-6 md:flex-none">
            <div
              class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border p-8"
            >
              <div class="pb-0 mb-0 border-b-0 rounded-t-2xl">
                <h6 class="mb-0 dark:text-white text-black font-bold">GRIVANCE SUBMISSION FORM</h6>
              </div>
              <h2 class="text-lg font-bold mt-4">Step 2: Attach Evidence</h2>
              <h2 class="text-lg font-bold mb-4 mt-2">
                Problem Id:{{ saved_problem?.submitted_problem?.substring(0, 30) }}...
              </h2>
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
              <div class="flex justify-between items-center">
                <button
                  @click="prevStep"
                  class="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
                >
                  Back
                </button>
                <template v-if="isFormLoading">
                    <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
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
          </div>
        </div>
      </div>

      <!-- Contact Form End -->
    </div>
  </div>
</template>
<style></style>
