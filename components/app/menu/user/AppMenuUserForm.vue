<script setup lang="ts">
import { object, string } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

interface Login {
  name: string;
  password: string;
}

interface Signup extends Login {
  email: string;
}

type Fields = Login | Signup;

const step = defineModel("step", { required: true });
const appStore = useAppStore();
const { isAppLoadingVisible } = storeToRefs(appStore);
const { toast } = appStore;
const schema = computed(() => {
  const loginSchema = {
    name: string().required().max(50),
    password: string().required().max(50),
  };
  const signupSchema = {
    ...loginSchema,
    email: string().email().required(),
  };
  return toTypedSchema(object(step.value == 0 ? loginSchema : signupSchema));
});
const { handleSubmit, resetForm } = useForm({ validationSchema: schema });
const onSubmit = handleSubmit((values: Fields) => {
  if ("email" in values) signup(values);
  else login(values);
});

async function signup(reqBody: Signup) {
  isAppLoadingVisible.value = true;
  await $fetch("/api/user/register", {
    method: "POST",
    body: reqBody,
  });
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Successfully registered.",
    life: 3000,
  });
  onStepChange(0);
  isAppLoadingVisible.value = false;
}

async function login(reqBody: Login) {}

function onStepChange(newStep: 0 | 1) {
  step.value = newStep;
  resetForm();
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-col gap-3">
      <AppMenuUserInput label="User Name" name="name" />
      <AppMenuUserInput label="Password" name="password" is-password />
      <Transition name="email">
        <AppMenuUserInput v-show="step == 1" label="Email" name="email" />
      </Transition>
    </div>
    <Transition name="button" mode="out-in">
      <div v-if="step == 0" class="flex w-full justify-end gap-2">
        <Button type="button" label="Login" @click="onSubmit"></Button>
        <Button type="button" label="Sign Up" @click="onStepChange(1)"></Button>
      </div>
      <div v-else class="flex w-full justify-end gap-2">
        <Button type="button" label="Sign Up" @click="onSubmit"></Button>
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="onStepChange(0)"
        ></Button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.button-enter-active,
.button-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.button-enter-from,
.button-leave-to {
  @apply opacity-0;
}

.email-enter-active,
.email-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.email-enter-from,
.email-leave-to {
  @apply translate-x-12 opacity-0;
}
</style>
