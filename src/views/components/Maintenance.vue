<script setup lang="ts">
</script>

<template>
  <div class="maintenance">
    <div>
      <div class="logo"></div>
      <h2>Under maintenance</h2>
      <p>업데이트 중입니다. <br>잠시 후 다시 접속해 주세요.</p>
    </div>
    <p class="copyright">Design Kit is a design asset <br>service by Newtype Imageworks</p>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

.maintenance { .flex-center(); .h(100vh); .tc; .bgc(#0D0D0D);
  > div { .w(240); .mh-c; }
  .logo { .ib; .wh(111, 24); .contain('/image/common/pwd-logo.png')}
  h2 { .mt(36); .fs(20, 1.3); .semi-bold; .c(#fff); }
  h2 + p { .mt(12); .fs(14, 1.6); .c(#aaa); }
  .copyright { .fix; .lb(0, 40); .wf; .tc; .fs(14, 1.3); .c(#fff); .o(0.5); }
}

@media (@tl-up) {
  .maintenance {
    .logo { .wh(139, 30); }
    h2 { .mt(50); .fs(24, 1.3); }
    .copyright { .lb(0, 30); }
  }
}

@media (@dm-up) {
  .maintenance {
    > div { .w(300); }
  }
}
</style>
