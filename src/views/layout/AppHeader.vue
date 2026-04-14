<script lang="ts" setup>
import { computed, inject, nextTick, Ref, ref, watch, watchEffect } from 'vue';
import { useBrowserStore } from '@/store/browser.store';
import CdnImg from '@/views/components/CdnImg.vue';
import { usePage } from '@/store/page';
import DrawerMenuItem from '@/views/components/DrawerMenuItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { normalizeString } from '@/utils';

const browserStore = useBrowserStore();
const pageStore = usePage();

const menuOpen = ref(false);

const roll = computed(() => {
  if (menuOpen.value) return '';
  return browserStore.scrollValue > 100 && browserStore.scrollDirection === 'down' && 'roll';
});

function toggleDrawer() {
  menuOpen.value = !menuOpen.value;
}

const route = useRoute();
const router = useRouter();

const type = computed(() => pageStore.info?.type.toLocaleLowerCase());
const goHome = () => router.push(`/${route.params.project}/`);

const anchors = computed(() => pageStore.current?.anchors || []);
const activeAnchor = inject<Ref<string>>('activeAnchor');
const isActiveAnchor = ref(false);
const anchorHeight = computed(() => isActiveAnchor.value ? `${anchors.value?.length * 48 + 24}px` : '0px');

function scrollToTitle(title: string) {
  isActiveAnchor.value = false;
  router.push({ ...route, hash: `#${title}` });
}

watch(() => route.fullPath, () => {
  menuOpen.value = false;
});

</script>

<template>
  <div app-header :class="[roll, type]">
    <header>
      <div class="logo">
        <a>
          <cdn-img :src="pageStore.info?.logoImage" :alt="pageStore.info?.title" v-if="pageStore.info?.logoImage"/>
          <h1 v-if="type === 'essential' || !pageStore.info?.logoImage">
            {{ type === 'essential' ? 'Brand Guide' : pageStore.info?.title }} </h1>
        </a>
      </div>
      <aside class="drawer" :class="{ on: menuOpen }">
        <div class="drawer-holder">
          <nav class="drawer-menu">
            <ul>
              <drawer-menu-item v-for="item in pageStore.menuTree" :key="item.code" :item="item" :depth="0"/>
            </ul>
          </nav>
        </div>
      </aside>
      <a class="btn-hamburger" :class="{ on: menuOpen }" @click="toggleDrawer"></a>
    </header>
    <div class="anchors" :class="{ 'on': isActiveAnchor}" v-if="activeAnchor">
      <a class="current" @click="isActiveAnchor = !isActiveAnchor">{{ activeAnchor }}</a>
      <ol :style="{ height: anchorHeight }">
        <li v-for="row in anchors" :key="row.name">
          <a href="#" @click.prevent="scrollToTitle(row.title)" :class="{ 'on': activeAnchor === normalizeString(row.title) }">
            {{ row.title }}
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj';
.ir { .ir; }

[app-header] { .fix; .lt; .wf; z-index: 49;
  &.roll {
    header { .t-y(-100%); pointer-events: none; }
  }
  &.roll.footerVisible, &.footerVisible {
    header { .t-y(0); }
  }

  header { .rel; .bgc(#fff); .wf; .h(60); .t-y(0); transition: transform 0.6s ease; z-index: 2;
    .logo { .rel; .wh(100%, 60); .p(15, 20); .-b(#E8EAED); .z(4);
      a { .block; }
      img { .block; .h(30); }
      h1 { .fs(18, 30); .bold; }
    }
    .btn-hamburger { .block; .wh(24); .contain('/image/common/ico-hamburger.svg'); .bg-c; .no-repeat; .abs; .rt(20, 18); .z(5);
      &.on { .bg('/image/common/ico-close.svg'); .wh(20); }
    }

  }
  .drawer { .abs; .lt; .wf;
    .drawer-holder { .abs; .rt; .wf; .fvh; .t-x(100%); .bgc(#fff); overflow-y: auto; .-box; transition: transform 0.4s ease;
      .drawer-menu { .p(60, 0, 40);
        a { .block; .rel;
          &:after { .cnt; .abs; .rt(20, 50%); .mt(-7); .wh(14); .contain('/image/common/ico-arrow-down.svg'); }
          &.on:after { transform: rotate(180deg); }
        }
        > ul > li > a { .p(20); .fs(18, 1.2); .medium; .-v(#E8EAED); .mt(-1);
          & + ul { .p(20); }
        }
        ul ul {
          > li + li { .mt(16); }
          a { .rel; .pv(12); .fs(16, 1.2); .medium;
            &:after { .r(0); }
          }
          ol a { .ph(12); .c(#666); .br(4); .tr-d(.4s);
            &:after { .hide; }
            .no-touch &:not(.on):hover { .bgc(#F9F9F9); }
            &.on { .bgc(#F3F4F6); .br(4); }
          }
        }
      }
    }
    &.on {
      .drawer-holder { .t-x(0); }
    }
  }
  &.essential {
    header {
      img + h1 { .hide; }
    }
  }

  .anchors { .fix; .t(0); .wf; .z(1); .bgc(#fff); .fs(16, 19);
    .current { .block; .rel; .h(59); .p(20, 30); .-box; .medium;
      &:after { .cnt; .abs; .rt(20, 50%); .mt(-7); .wh(14); .contain('/image/common/ico-arrow-down.svg'); }
    }
    ol { .p(0, 30); .-t(#E8EAED); .tr-d(.3s); .crop;
      li {
        a { .block; .pv(12); .c(#999); .tr-d(0.2s);
          &.on { .c(#000); .medium; }
        }
      }
    }

    &.on {
      .current:after { transform: rotate(180deg); }
      ol { .-b(#E8EAED); .pv(12); }
    }
  }
}

@media (@tl-up) {
  [app-header] {
    header { .h(70);
      .logo { .h(70); .p(20, 24); }
      .btn-hamburger { .hide; }
    }
    .drawer { .rel; .h(calc(100vh - 70px)); .w(240); .-r(#E8EAED);
      .drawer-holder { .rel; .f; .t-x(0);
        .drawer-menu { .p(0);
          > ul > li > a { .ph(24);
            & + ul { .ph(24); }
          }
        }
      }
    }
    &.essential {
      header { .wh(240, auto); .-r(#E8EAED);
        .logo { .h(auto); }
        img + h1 { .block; .m(12, 0, 0); .medium; .fs(16, 1); }
      }
    }

    .anchors { .hide; }
  }

  @media (@ds-up) {
    [app-header] { .fix; .lt; .wf; z-index: 49;
      &.roll {
        header { .t-y(0); pointer-events: auto; }
      }
      .drawer { .w(300); }
      &.essential {
        header { .w(300); }
      }
    }
  }
}
</style>