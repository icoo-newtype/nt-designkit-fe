<script setup lang="ts">

import BButton from '@/views/components/common/BButton.vue';
import { getMediaTypeFromPath } from '@/utils';
import CdnImg from '@/views/components/CdnImg.vue';

defineProps<{
  info: Record<string, any>
}>();

const cdnHost = import.meta.env.VITE_CDN_HOST;

const formatCapacity = (bytes: number | string): string => {
  const b = Number(bytes);
  if (isNaN(b) || b === 0) return '0.0KB';
  if (b >= 1024 ** 3) return `${(b / 1024 ** 3).toFixed(1)}GB`;
  if (b >= 1024 ** 2) return `${(b / 1024 ** 2).toFixed(1)}MB`;
  return `${(b / 1024).toFixed(1)}KB`;
};

const download = (url: string) => {
  window.open(url, '_blank');
};
</script>
<template>
  <div fe-resource>
    <div class="item" v-for="row in info.value" :key="row.filename">
      <div class="box" v-if="row.location">
        <cdn-img :src="row.thumb"/>
        <div>
          <p class="name">{{ row.filename }}</p>
          <p>{{ row.type }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ row.size }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ formatCapacity(row.capacity) }}</p>
          <b-button variant="default" @click="download(`${cdnHost}/${row.location}`)">Download</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[fe-resource] { .mb(20);
  .item {
    .box { .br(6); .bgc(#F8F8F8); .p(20, 16); .flex; }
    img { .block; .w(117); aspect-ratio: 16 / 9; object-fit: contain; }
    img + div { flex-grow: 1; .ml(20); .rel;
      .name { .fs(15); .semi-bold; }
      .name + p { .hide; }
      .btn { .abs; .lb; .ph(12); }
      .btn-default { .bgc(#efefef); .-a(#efefef);
        &:hover { .bgc(#e0e0e0); .-a(#e0e0e0); }
        &:focus { .bgc(#efefef); .-a(#efefef); }
      }
    }
  }
  .item + .item { .mt(20); }
}

@media (@tp-up) {
  [fe-resource] {
    .item {
      .box { .p(20); }
      img { .w(200); }
      img + div { .ml(30);
        .name { .fs(16); }
        .name + p { .block; .mt(4); .c(#666); .fs(13); }
      }
    }
  }
}

@media (@ds-up) {
  [fe-resource] { .mb(30); .grid(2, 30);
    .item {
      img + div .btn { .rb; }
    }
    .item + .item { .mt(0); }
  }
}
</style>