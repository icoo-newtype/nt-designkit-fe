<script setup lang="ts">

import { inject, ref, watchEffect } from 'vue';
import TextBox from '@/views/components/form/TextBox.vue';
import BasicText from '@/views/components/modules/BasicText.vue';
import MediaSelect from '@/views/components/form/MediaSelect.vue';

// 가로 상세 페이지형 (PDF 1페이지 = 좌측 텍스트 30% / 우측 이미지 70%)
const props = defineProps({
  modelValue: { type: Object, default: null },
  type: { type: String, default: null },
});
const emit = defineEmits(['update:modelValue']);

const data = ref<Record<string, any>>({});
const filekey = inject('filekey') as string;

const change = () => {
  emit('update:modelValue', data.value);
};

watchEffect(() => {
  data.value = props.modelValue || {};
  emit('update:modelValue', data.value);
});
</script>

<template>
  <div detail-module>
    <div class="text">
      <TextBox required class="title" placeholder="타이틀을 입력해주세요." v-model="data.title" @input="change" no-resize/>
      <BasicText v-model="data.text" @input="change"/>
    </div>
    <div class="visual">
      <media-select required media-type="image" :filekey="filekey" v-model="data.media" @update:model-value="change" message="권장 비율 (16:9)"/>
      <TextBox placeholder="캡션을 입력해 주세요" v-model="data.caption" @input="change" class="caption" :rows="2"/>
    </div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[detail-module] { .grid; grid-template-columns: 3fr 7fr; gap: 20px; .p(20);
  .title { .fs(24, 1.3); .medium; }
  .visual {
    [image-select] .holder { aspect-ratio: 16 / 9; .min-h(0);
      img { .wf; .hf; object-fit: contain; }
    }
    .caption { .mt(8); }
  }
}
</style>
