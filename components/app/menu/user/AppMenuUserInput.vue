<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    isPassword: boolean;
  }>(),
  { isPassword: false },
);

const { value, errorMessage, meta, handleChange, handleBlur } =
  useField<string>(() => props.name, undefined, {
    validateOnValueUpdate: false,
  });
const inputOn = {
  change: handleChange,
  input: (evt: Event) => handleChange(evt, !!errorMessage),
  blur: (evt: Event) => handleBlur(evt, true),
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="name" class="font-semibold">{{ label }}</label>
    <InputText
      v-if="!isPassword"
      v-model="value"
      :id="name"
      autocomplete="off"
      v-on="inputOn"
       class="!w-full"
    />
    <Password v-else v-model="value" :feedback="false" toggle-mask pt:pcInput:class="w-full" v-on="inputOn" />
    <small v-show="errorMessage && meta.touched" class="text-alert">{{
      errorMessage
    }}</small>
  </div>
</template>
