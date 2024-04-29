<script setup lang="ts">
import DataStatsOne from '@/components/DataStats/DataStatsOne.vue'
import ChartOne from '@/components/Charts/ChartOne.vue'
import ChartThree from '@/components/Charts/ChartThree.vue'
import ChartTwo from '@/components/Charts/ChartTwo.vue'
import ChatCard from '@/components/ChatCard.vue'
import MapOne from '@/components/Maps/MapOne.vue'
import TableOne from '@/components/Tables/TableOne.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <DataStatsOne />
    </div>

    <div class="mt-4 md:mt-6 md:gap-6 2xl:mt-7.5">
      <ChartOne />
    </div>

    <div class="mt-4 grid grid-cols-12 gap-1 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

      <div class="col-span-6 xl:col-span-6">
        <ChartThree />
      </div>
      <!-- ====== Table One Start -->
      <div class="col-span-6 xl:col-span-6">
        <ChartTwo />
      </div>

    </div>
  </DefaultLayout>
</template>
