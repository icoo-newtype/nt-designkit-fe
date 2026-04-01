<script lang="ts" setup>
import { usePage } from '@/store/page';
import CdnImg from '@/views/components/CdnImg.vue';
import { computed } from 'vue';

const cdnHost = import.meta.env.VITE_CDN_HOST;
const pageStore = usePage();

const resource = computed(() => {
  return pageStore.info?.resource ?? [];
});
</script>
<template>
  <footer app-footer>
    <div class="split-warp">
      <div class="logo">
        <cdn-img :src="pageStore.info?.footerLogoImage" :alt="pageStore.info?.title" v-if="pageStore.info?.footerLogoImage"/>
      </div>
      <div class="resource">
        <p>Resource</p>
        <ul>
          <li v-for="row in resource as FileItem[]" :key="row.sq">
            <a target="_blank" :href="`${cdnHost}/${row.location}`">{{ row.fileName }}</a>
          </li>
        </ul>
      </div>
    </div>
    <p class="copyright">© 2026 Newtype Inc.</p>
  </footer>
</template>
<style lang="less">
@import '~@/less/proj';
[app-footer] { .rel; .p(40, 20, 50); .bgc(#000); .c(#fff);
  .logo {
    img { .block; .h(50); }
  }
  .resource { .mt(80);
    p { .fs(20); .semi-bold; .mb(30); }
    ul { .-b(rgba(255, 255, 255, 0.20));
      li { .rel; .-t(rgba(255, 255, 255, 0.20)); .pv(8);
        &:after { .cnt; .abs; .rt(4, 50%); .t-yc; .wh(16); .contain('/image/common/ico-download-w.svg'); }
      }
    }
  }
  .copyright { .mt(120); .-t(#333); .pt(20); }
}

@media (@tp-up) {
  [app-footer] { .p(70, 30, 50);
    .split-warp { .grid(2); }
    .resource { .mt(0); }
    .copyright { .mt(120); .fs(14, 1.3); .c(#808080); }
  }
}

@media (@tl-up) {
  [app-footer] { .p(70, 50, 50); }
}

@media (@dm-up) {
  [app-footer] { .p(70, 70, 50);
    .resource {
      p { .fs(24); }
    }
  }
}
</style>
