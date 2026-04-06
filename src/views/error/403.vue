<script setup lang="ts">
</script>
<template>
  <div error>
    <header>
      <a href="/admin/" class="logo"><h1 class="ir">AA archigroup</h1></a>
    </header>
    <h2>권한이 없습니다.</h2>
    <a href="/admin/" class="btn-home">홈으로 가기</a>
  </div>
</template>
<style lang="less">
@import "~@/less/proj";
.ir { .ir; }

[error] { .rel; .h(100vh); .flex; .flex-column; .justify-center; .items-center; .tc; .ph(16);
  header { .fix; .lt;
    a.logo { .block; .wh(132,20); .abs; .lt(24, 24); .contain('/admin_image/logo.svg'); z-index: 2; }
  }
  h2 { .fs(36,1); .bold; }
  h2 + p { .mt(24); .fs(14,1.6); }
  .btn-home { .mt(40); .p(0,30); .h(40); .fs(16,40); .c(#fff); .bgc(#000); .br(3); }
}
</style>
