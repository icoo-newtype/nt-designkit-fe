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
    <h2 v-html="info.value.title"></h2>
    <div v-html="info.value.text" v-if="hasText(info.value.text)"></div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[fe-title-text] {
  h2 { .mb(0); }
  &.header { .pt(60); .pb(20);
    h2 { .fs(40, 1.1); }
    h2 + div { .mt(100); .fs(18, 1.5); .medium; }
  }
  &.title { .pt(20); .pb(60);
    h2 { .fs(28, 1.3); }
    h2 + div { .mt(30); }
  }
  &.sub-title { .pb(30);
    h2 { .fs(20, 1.3); .semi-bold; }
    h2 + div { .mt(12); }
  }
}

@media (@tp-up) {
  [fe-title-text] {
    &.header { .pt(80); .pb(30);
      h2 { .fs(48); }
      h2 + div { .mt(120); .fs(20, 1.5); }
    }
    &.title {
      h2 { .fs(32, 1.3); }
      h2 + div { .mt(30); .fs(18, 1.5); }
    }
  }
}

@media (@tl-up) {
  [fe-title-text] {
    &.header { .pt(100);
      h2 { .fs(56); }
      h2 + div { .mt(120); .fs(22, 1.5); }
    }
    &.title { .grid(2, 16); .pt(30);
      h2 { .fs(36, 1.3); }
      h2 + div { .mt(0); }
    }
  }
}

@media (@ds-up) {
  [fe-title-text] {
    &.header {
      h2 { .fs(76); }
      h2 + div { .mt(160); .fs(26, 1.5); }
    }
    &.title { .grid(2, 20); .pb(80);
      h2 { .fs(44, 1.3); }
    }
    &.sub-title {
      h2 { .fs(24, 1.3); .semi-bold; }
    }
  }
}
</style>