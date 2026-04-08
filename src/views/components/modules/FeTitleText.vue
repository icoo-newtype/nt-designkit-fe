<script setup lang="ts">

defineProps<{
  info: Record<string, any>
}>();

const hasText = (text: string): boolean => {
  if (!text) return false;

  const stripped = text.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 0;
};
</script>
<template>
  <div fe-title-text :class="info.type">
    <p v-html="info.value.title"></p>
    <div v-html="info.value.text" v-if="hasText(info.value.text)"></div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[fe-title-text] { .fs(16);
  &.header { .pt(60); .pb(60);
    > p { .fs(40, 1.1); }
    > p + div { .mt(100); .fs(18, 1.5); .medium; }
  }
  &.title { .rel; .pt(20); .pb(60);
    &:before { .cnt; .abs; .t; .l(20); .r(20); .m(auto); .h(1); .bgc(#E8EAED); }
    > p { .fs(28, 1.3); }
    > p + div { .mt(30); }
  }
  &.sub-title { .pb(30);
    > p { .fs(20, 1.3); .semi-bold; }
    > p + div { .mt(12); }
  }
}

@media (@tp-up) {
  [fe-title-text] {
    &.header { .pt(80); .pb(80);
      > p { .fs(48); }
      > p + div { .mt(120); .fs(20, 1.5); }
    }
    &.title {
      &:before { .l(30); .r(30); }
      > p { .fs(32, 1.3); }
      > p + div { .mt(30); .fs(18, 1.5); }
    }
  }
}

@media (@tl-up) {
  [fe-title-text] {
    &.header { .pt(100);
      > p { .fs(56); }
      > p + div { .mt(120); .fs(22, 1.5); }
    }
    &.title { .grid(2, 16); .pt(30);
      > p { .fs(36, 1.3); }
      > p + div { .mt(0); }
    }
  }
}

@media (@ds-up) {
  [fe-title-text] {
    &.header {
      > p { .fs(76); }
      > p + div { .mt(160); .fs(26, 1.5); }
    }
    &.title { .grid(2, 20); .pb(80);
      &:before { .l(70); .r(70); }
      > p { .fs(44, 1.3); }
    }
    &.sub-title {
      > p { .fs(24, 1.3); .semi-bold; }
    }
  }
}
</style>