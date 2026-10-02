<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { AnimationItem } from 'lottie-web';

const illust = ref<HTMLElement>();
let animation: AnimationItem | undefined;

onMounted(async () => {
  const { default: lottie } = await import('lottie-web/build/player/lottie_light_canvas');
  if (!illust.value) return;
  animation = lottie.loadAnimation({
    container: illust.value,
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    path: '/image/common/inspection.json',
  });
});

onBeforeUnmount(() => animation?.destroy());
</script>

<template>
  <div class="maintenance">
    <div>
      <div class="logo"></div>
      <div class="illust" ref="illust"></div>
      <h2>Updates Coming Soon</h2>
      <p>업데이트가 완료되면 알려드릴게요.</p>
    </div>
    <p class="copyright">Design Kit is a design asset <br>service by Newtype Imageworks</p>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

.maintenance { .flex-center(); .h(100vh); .tc; .bgc(#0D0D0D);
  > div { .w(240); .mh-c; }
  .logo { .ib; .wh(111, 24); .contain('/image/common/pwd-logo.png')}
  // 애니메이션 자체 배경(#000)이 페이지 배경과 구분되지 않도록 blend 처리
  .illust { .wh(180); .mh-c; .mt(28); mix-blend-mode: screen; }
  h2 { .mt(20); .fs(20, 1.3); .semi-bold; .c(#fff); white-space: nowrap; }
  h2 + p { .mt(12); .fs(14, 1.6); .c(#aaa); }
  .copyright { .fix; .lb(0, 40); .wf; .tc; .fs(14, 1.3); .c(#fff); .o(0.5); }
}

@media (@tl-up) {
  .maintenance {
    .logo { .wh(139, 30); }
    .illust { .wh(220); .mt(36); }
    h2 { .mt(24); .fs(24, 1.3); }
    .copyright { .lb(0, 30); }
  }
}

@media (@dm-up) {
  .maintenance {
    > div { .w(300); }
  }
}
</style>
