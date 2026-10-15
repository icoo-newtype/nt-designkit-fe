<script setup lang="ts">

import { ref, watchEffect } from 'vue';
import TextBox from '@/views/components/form/TextBox.vue';
import BasicText from '@/views/components/modules/BasicText.vue';

// 가로 표지형 (PDF 1페이지 = 16:9 표지)
const props = defineProps({
  modelValue: { type: Object, default: null },
  type: { type: String, default: null },
});
const emit = defineEmits(['update:modelValue']);

const DEFAULT_BG = '#C4BEF7';
const data = ref<Record<string, any>>({});

const change = () => {
  emit('update:modelValue', data.value);
};

watchEffect(() => {
  data.value = props.modelValue || {};
  if (!data.value.bgColor) data.value.bgColor = DEFAULT_BG;
  emit('update:modelValue', data.value);
});
</script>

<template>
  <div cover-module>
    <div class="color">
      <span>배경 색상</span>
      <input type="color" v-model="data.bgColor" @input="change">
      <TextBox class="hex" placeholder="#C4BEF7" :maxlength="7" v-model="data.bgColor" @input="change"/>
    </div>
    <div class="view" :style="{ backgroundColor: data.bgColor }">
      <TextBox required class="title" placeholder="타이틀을 입력해주세요." v-model="data.title" @input="change" no-resize/>
      <BasicText v-model="data.text" @input="change"/>
    </div>
    <TextBox placeholder="캡션을 입력해 주세요" v-model="data.caption" @input="change" class="caption" :rows="2"/>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[cover-module] { .p(20);
  .color { .flex; .items-center; .mb(10); .fs(13); .c(#898989);
    input[type=color] { .wh(32); .p(0); .ml(10); .-a(#cfcfcf); .br(4); .bgc(#fff); cursor: pointer; }
    .hex { .w(110); .ml(8); }
  }
  .view { .flex; .flex-column; .justify-center; aspect-ratio: 16 / 9; .p(40); .br(10); .-box;
    .form-control { background: transparent; .-a(transparent); }
    .title { .fs(48, 1.2); .medium; }
  }
  .caption { .mt(8); }
}
</style>
