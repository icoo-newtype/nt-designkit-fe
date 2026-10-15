<script setup lang="ts">

import { enterToBr } from '@/utils';

defineProps<{
  info: Record<string, any>
}>();

const hasText = (text: string): boolean => !!text && text.replace(/<[^>]*>/g, '').trim().length > 0;
</script>
<template>
  <div fe-cover>
    <div class="view" :style="{ backgroundColor: info.value.bgColor }">
      <p class="title" v-html="enterToBr(info.value.title)"></p>
      <div class="text" v-html="info.value.text" v-if="hasText(info.value.text)"></div>
    </div>
    <p class="caption" v-html="enterToBr(info.value.caption)" v-if="info.value.caption"></p>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

// 크기는 FeTitleText(header) 단계에 맞춤. letter-spacing은 em으로 지정해 크기에 비례 (76px: -1.52px, 26px: -1.3px)
[fe-cover] { .pv(10);
  .view { .flex; .flex-column; .justify-center; aspect-ratio: 16 / 9; .p(24); .br(10); .-box; .c(#111); }
  .title { .fs(40, 1.1); font-weight: 400; letter-spacing: -0.02em; text-transform: capitalize; }
  .text { .mt(24); .fs(18, 1.5); .medium; letter-spacing: -0.05em; }
  .caption { .m(8, 0, 10); .fs(14, 1.4); .c(#666); }
}

@media (@tp-up) {
  [fe-cover] {
    .view { .p(40); }
    .title { .fs(48); }
    .text { .mt(36); .fs(20); }
  }
}

@media (@tl-up) {
  [fe-cover] {
    .title { .fs(56); }
    .text { .mt(48); .fs(22); }
  }
}

@media (@ds-up) {
  [fe-cover] {
    .view { .p(60); }
    .title { .fs(76); }
    .text { .mt(60); .fs(26); }
  }
}

@media (@dm-up) {
  [fe-cover] {
    .caption { .mt(12); }
  }
}
</style>
