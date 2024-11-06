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

const { loginDialogVisible } = storeToRefs(useAppStore());
const { login } = useAuthStore();

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
  if ("email" in values && values.email) signup(values);
  else onLogin(values);
});

async function signup(reqBody: Signup) {
  isAppLoadingVisible.value = true;

  try {
    await api("/api/user/register", { method: "POST", body: reqBody });
  } finally {
    isAppLoadingVisible.value = false;
  }

  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Successfully registered.",
    life: 3000,
  });
  onStepChange(0);
}

async function onLogin(reqBody: Login) {
  isAppLoadingVisible.value = true;

  try {
    await login(reqBody.name, reqBody.password);
  } finally {
    isAppLoadingVisible.value = false;
  }

  toast.add({
    severity: "success",
    summary: "Success",
    detail: `Welcome ${reqBody.name}`,
    life: 3000,
  });
  loginDialogVisible.value = false;
}

function onStepChange(newStep: 0 | 1) {
  step.value = newStep;
  resetForm();
}
</script>

<template>
  <form>
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
  </form>
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
