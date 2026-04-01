<script setup lang="ts">
import { ref } from 'vue';
import oax from '@/utils/oax';
import { useLoginPageStore } from '@/store/auth';
import { useToast } from '@/plugins/toast';
import TextInput from '@/views/components/form/TextInput.vue';
import BButton from '@/views/components/common/BButton.vue';
import BForm from '@/views/components/common/BForm.vue';

const props = defineProps<{
  project: string;
}>();

const pageStore = useLoginPageStore();
const warning = useToast({ type: 'error' });
const password = ref('');
const validator = ref();

const checkPassword = async () => {
  if (!await validator.value?.validate()) return;

  try {
    const { data: isMatched } = await oax.post<boolean>('/api/project/checkPassword', {
      slug: props.project,
      password: password.value
    });

    if (isMatched) {
      pageStore.setLoginPage(props.project);
    } else {
      warning('비밀번호가 일치하지 않습니다.');
      password.value = '';
    }
  } catch (e) {
    warning('인증 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div class="password-form">
    <b-form ref="validator">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
        </svg>
      </div>
      <p>Enter password to access the <br>site.</p>
      <text-input required type="password" placeholder="Password" v-model="password" @enter="checkPassword" mandatory no-message autocomplete="current-password"/>
      <b-button variant="secondary" @click="checkPassword">Submit</b-button>
    </b-form>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

.password-form { .flex-center(); .h(100vh); .tc;
  > div { .p(0, 47); .wf; .-box; }
  .icon + p { .mt(12); .fs(12); .c(#777); }
  [text-input] { .mv(30); }
  .btn { .wf; }
}

@media (@tp-up) {
  .password-form {
    > div { .p; .w(280); }
  }
}
</style>