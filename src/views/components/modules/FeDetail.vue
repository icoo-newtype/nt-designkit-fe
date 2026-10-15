<script setup lang="ts">

import CdnImg from '@/views/components/CdnImg.vue';
import { enterToBr } from '@/utils';

defineProps<{
  info: Record<string, any>
}>();

const hasText = (text: string): boolean => !!text && text.replace(/<[^>]*>/g, '').trim().length > 0;
</script>
<template>
  <div fe-detail>
    <div class="text">
      <p class="title" v-html="enterToBr(info.value.title)"></p>
      <div v-html="info.value.text" v-if="hasText(info.value.text)"></div>
    </div>
    <div class="visual">
      <div class="view">
        <cdn-img :src="info.value.media" v-if="info.value.media"/>
      </div>
      <p class="caption" v-html="enterToBr(info.value.caption)" v-if="info.value.caption"></p>
    </div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[fe-detail] { .pv(20); .fs(16, 1.5); .c(#000); letter-spacing: -0.02em;
  .title { .fs(22, 1.3); .semi-bold; .c(#111); letter-spacing: -0.02em; }
  .title + div { .mt(12); }
  .visual { .mt(20); }
  .view { aspect-ratio: 687 / 456; .br(10); .crop; .bgc(#F7F7F7);
    img { .block; .wh(100%); object-fit: cover; }
  }
  .caption { .m(8, 0, 10); .fs(14, 1.4); .c(#666); }
}

@media (@tl-up) {
  [fe-detail] { .grid; grid-template-columns: 3fr 7fr; gap: 46px; .pv(30);
    .title { .fs(24); }
    .visual { .mt(0); }
  }
}
</style>
