import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
}

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<Alert[]>([]);

  function addAlert({ title, message, duration = 5000, type }: { title: string; message: string; duration?: number; type: string }): void {

    const id = setTimeout(() => {
      removeAlert(alerts.value.findIndex(alert => alert.id === id));
    }, duration);
    alerts.value.push({ id, title, message, type });
  }

  function clearAlerts(): void {
    alerts.value = [];
  }

  function removeAlert(index: number): void {
    clearTimeout(alerts.value[index].id);
    alerts.value.splice(index, 1);
  }

  return {
    alerts,
    addAlert,
    clearAlerts,
    removeAlert
  };
});
