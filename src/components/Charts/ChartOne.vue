<script setup lang="ts">
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'
import { DivisionUrls } from '@/utils/apis'
import { useDivisionsStore } from '@/stores/departmentsStore'
import { useAlertStore } from '@/stores/alert'
import { onMounted, ref } from 'vue'
import AlertWarning from '@/components/Alerts/AlertWarning.vue'

interface statInterface {
  users: number
  divisions: number
  solved_problems: number
  unsolved_problems: number
  chart_one: any
  chart_two: any
  chart_3: any
}
const alertStore = useAlertStore()
const depStore = useDivisionsStore()
const data = ref<statInterface>()
const chartData = ref()
const apexOptions = ref()

const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await depStore.getUserGrivances(DivisionUrls.dashboardStats)
    console.log(res)

    if (res) {
      chartData.value = res?.chart_one
      const apexOptions1 = {
        legend: {
          show: false,
          position: 'top',
          horizontalAlign: 'left'
        },
        colors: ['#3C50E0', '#80CAEE','#8FD0EF', '#0FADCF'],
        chart: {
          fontFamily: 'Satoshi, sans-serif',
          height: 335,
          type: 'area',
          dropShadow: {
            enabled: true,
            color: '#623CEA14',
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1
          },

          toolbar: {
            show: false
          }
        },
        responsive: [
          {
            breakpoint: 1024,
            options: {
              chart: {
                height: 300
              }
            }
          },
          {
            breakpoint: 1366,
            options: {
              chart: {
                height: 350
              }
            }
          }
        ],
        stroke: {
          width: [2, 2],
          curve: 'straight'
        },

        labels: {
          show: false,
          position: 'top'
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 4,
          colors: '#fff',
          strokeColors: ['#3056D3', '#80CAEE'],
          strokeWidth: 3,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          hover: {
            size: undefined,
            sizeOffset: 5
          }
        },
        xaxis: {
          type: 'category',
          categories: res?.chart_one?.labels,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          title: {
            style: {
              fontSize: '0px'
            }
          },
          min: 0,
          max: 100
        }
      }
      apexOptions.value = apexOptions1
    }
  } catch (error: any) {
    console.error('Error fetching divisions:', error)
    alertStore.addAlert({
      title: 'Error',
      message: 'Failed to fatch stats',
      duration: 30000,
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
})

console.log(chartData);
console.log(apexOptions);


const chart = ref(null)
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8"
  >
    <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
      <div class="flex w-full flex-wrap gap-3 sm:gap-5">
        <div class="flex min-w-full">
          <span
            class="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary"
          >
            <span class="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
          </span>
          <div class="w-full">
            <p class="font-semibold text-primary">Grievance submission based on Problem types</p>
            <p class="text-sm font-medium">04.2024 - 03.2024</p>
          </div>
        </div>
        
      </div>
      <!-- <div class="flex w-full max-w-45 justify-end">
        <div class="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button
            class="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
          >
            Day
          </button>
          <button
            class="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
          >
            Week
          </button>
          <button
            class="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
          >
            Month
          </button>
        </div>
      </div> -->
    </div>
    <div>
      <div id="chartOne" class="-ml-5">
        <VueApexCharts
          type="area"
          height="350"
          :options="apexOptions"
          :series="chartData?.series"
          ref="chart"
        />
      </div>
    </div>
  </div>
</template>
