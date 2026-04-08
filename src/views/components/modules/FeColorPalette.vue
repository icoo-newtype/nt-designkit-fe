<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps<{
  info: Record<string, any>
}>();


const data = computed(() => props.info.value);
const length = computed(() => Number(props.info.type?.match(/\d+/)?.[0] ?? 0));

</script>
<template>
  <div fe-color-palette>
    <p class="title" v-if="data.title">{{ data.title }}</p>
    <ul :class="`column-${length}`">
      <li v-for="(row, i) in data.colors" :key="i">
        <p class="sub-title" v-if="row.subTitle">{{ row.subTitle }}</p>
        <div class="view" :class="{ outline: ['FFF', 'FFFFFF'].includes(row.color.toUpperCase()) }" :style="{ backgroundColor: `#${row.color}` }"></div>
        <p class="color">#{{ row.color }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[fe-color-palette] {
  .title { .fs(16, 1.4); .semi-bold; .mb(20); }
  ul { .grid(2); grid-column-gap: 10px; grid-row-gap: 16px;
    li { .flex; flex-direction: column; justify-content: flex-end;
      .sub-title { .fs(14, 1.4); .semi-bold; .mb(12); }
      .view { .br(6); .h(82);
        &.outline { .-a(#E8EAED); }
      }
      .color { .mt(8); .c(#666); }
    }
  }

  & + & { .mt(16); }
}

@media (@tp-up) {
  [fe-color-palette] {
    ul {
      &.column-2 { .grid(2, 16); }
      &.column-4 { .grid(4, 16); }
      li {
        .view { .br(6); .h(120);}
      }
    }
  }
}

@media (@dm-up) {
  [fe-color-palette] {
    .title { .fs(20, 1.4); }
    ul {
      &.column-2 { .grid(2, 20); }
      &.column-4 { .grid(4, 20); }
      li {
        .sub-title { .fs(16, 1.4); }
        .view { .br(10); .h(200);}
      }
    }
    & + & { .mt(20); }
  }
}
</style>