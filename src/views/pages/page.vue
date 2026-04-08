<script setup lang="ts">
import { computed, nextTick, useHost, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useLoginPageStore } from '@/store/auth';
import PasswordGuard from '@/views/components/PasswordGuard.vue';
import { useBrowserStore } from '@/store/browser.store';
import AppHeader from '@/views/layout/AppHeader.vue';
import AppFooter from '@/views/layout/AppFooter.vue';
import { usePage } from '@/store/page';
import { getComponentsMap } from '@/views/components/modules';
import { useSocialHead } from '@/utils/meta';
import { useState } from '@/store/state';

const route = useRoute();
const state = useState();
const loginStore = useLoginPageStore();
const browserStore = useBrowserStore();
const pageStore = usePage();
const componentsMap = getComponentsMap();

const project = computed(() => route.params.project as string);
const category = computed(() => route.params.category as string);
const pageName = computed(() => route.params.page as string);
const isLogin = computed(() => loginStore.isLogin(project.value));

const article = computed(() => JSON.parse(decodeURIComponent(atob(pageStore.current?.article as string))));

useSocialHead({
  title: pageStore.info?.title,
  image: `${state.host}/${pageStore.info?.ogImage}`,
});

// route 변경 시 현재 페이지 동기화
watchEffect(() => {
  if (category.value && pageName.value) {
    pageStore.setCurrent(`${category.value}-${pageName.value}`);
  }
});

const normalize = (str: string) => str?.replace(/\s+/g, ' ').trim();
watch(() => route.hash, async (hash) => {
  if (!hash) return;
  const title = decodeURIComponent(hash.replace('#', ''));
  await nextTick();
  await nextTick();

  const titleItem = article.value.find(
      (item: any) => item.type === 'title' && item.value?.title === title
  );
  if (!titleItem) return;

  // title과 매칭되는 DOM 요소 찾기
  const elements = document.querySelectorAll('article [fe-title-text].title');
  const target = Array.from(elements).find(el => {
    const h2 = el.querySelector('p.title');

    return normalize(h2?.textContent as string) === normalize(title);
  });
  if (!target) return;

  window.scrollTo({ top: (target as HTMLElement).offsetTop, behavior: 'smooth' });
}, { immediate: true });

// resource 파싱 (info에서 직접)
const resourceList = computed(() => {
  const resource = pageStore.info?.resource;
  if (!resource) return [];
  try {
    return JSON.parse(decodeURIComponent(atob(resource as string)));
  } catch {
    return [];
  }
});
</script>

<template>
  <password-guard v-if="!isLogin" :project="project"/>
  <div v-else project-page :class="[
      browserStore.scrollDirection,
      browserStore.theme,
      { scrolled: browserStore.scrolled },
      { frozen: browserStore.frozen },
    ]">
    <app-header/>
    <article>
      <div class="content">
        <template v-for="(item, i) in article">
          <component :is="componentsMap[`Fe${item.comp}`]" :info="item" :key="`${item.type}-${i}`" v-if="item.type === 'blank' || item.value"/>
        </template>
      </div>
      <app-footer/>
    </article>
  </div>
</template>

<style lang="less">
@import '~@/less/proj';

ul, ol, dl { .m; }

[project-page] {
  article { .rel; .mt(60);
    .content { .wf; .crop;
      > div { .ph(20); }
    }
  }
}

@media (@tp-up) {
  [project-page] {
    article {
      .content > div { .ph(30); }
    }
  }
}

@media (@tl-up) {
  [project-page] {
    article { .mt(70); .ml(300);

    }
  }
}

@media (@ds-up) {
  [project-page] {
    article {
      .content > div { .ph(70); }
    }
  }
}
</style>