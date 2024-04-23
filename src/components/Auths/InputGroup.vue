
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'InputGroup',
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    max: {
      type:  Number,
      default: ''
    },
    min: {
      type:  Number,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      default: 'text'
    },
  },
  setup(props, { emit }) {
    const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);
    const internalValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      }
    });

    const emitInputEvent = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value);
    };

    return {
      inputId,
      internalValue,
      emitInputEvent
    };
  }
});
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ label }}</label>
    <div class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :id="inputId" v-model="internalValue" @input="emitInputEvent" :required="required" 
        :max="max" :min="min"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
