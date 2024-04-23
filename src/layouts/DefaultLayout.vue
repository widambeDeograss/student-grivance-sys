<script setup lang="ts">
import HeaderArea from '@/components/Header/HeaderArea.vue'
import SidebarArea from '@/components/Sidebar/SidebarArea.vue'
import { usersInfo } from '@/utils/apis';
import { useAuthStore } from '@/stores/authStore'
import { useAlertStore } from '@/stores/alert';
import { onMounted, ref } from 'vue';
import AlertWarning from '@/components/Alerts/AlertWarning.vue';

interface CurrentUser {
  id: string;
  first_name: string;
  last_name: string;
  role: number;
  username: string;
  email: string;
  profile:string;
}
const alertStore = useAlertStore()
const authStore = useAuthStore()
const currentUser = ref<CurrentUser>();

const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await authStore.getUserInfo(usersInfo.userInfo);

    
    if (res.role !== 1 && res.role !== 3 && res.role !==4 ) {
      const rs = await authStore.logout()
      if (rs) {
        window.location.reload()
      }
    }

    if (res) {
      currentUser.value = res;
    }


    // Further processing of division data if needed
  } catch (error: any) {
    console.error('Error fetching divisions:', error);
    alertStore.addAlert({
      title: 'Error',
      message: "Session Expired",
      duration: 30000,
      type: 'error'
    })
    const rs = await authStore.logout()
    if (rs) {
      window.location.reload()
    }
  } finally {
    isLoading.value = false
  }
})

console.log(currentUser.value);


</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <AlertWarning />
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Header Start ===== -->
      <HeaderArea :currentUser="currentUser"/>
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
