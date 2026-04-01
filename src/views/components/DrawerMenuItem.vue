<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PageItem, usePage } from '@/store/page';
import { ModalItem } from '@/plugins/modal/types';
import { ModuleItem } from '@/types/components';

const props = defineProps<{ item: PageItem; depth?: number }>();
const depth = props.depth ?? 0;

const route = useRoute();
const router = useRouter();
const page = usePage();
const hasChildren = !!props.item.children?.length;

const pageCode = computed(() => props.item.code.replace(`${props.item.parentCode}-`, ''));

const open = computed(() =>
    route.params.category === props.item.code ||
    props.item.children?.some(child => child.code === `${route.params.category}-${route.params.page}`)
);

const active = computed(() => open.value || route.params.page === pageCode.value);

// 임시 article 데이터 (추후 props.item.article에서 파싱)
const articleList = computed<ModuleItem[]>(() => {
  if (depth < 1) return [];
  // return ['page1', 'page2', 'page3']; // 임시
  return JSON.parse(decodeURIComponent(atob(props.item?.article as string))).filter((item: ModuleItem) => item.type === 'title');
});

function navigate() {
  if (hasChildren) {
    const first = props.item.children![0];
    const firstPageCode = first.code.replace(`${first.parentCode}-`, '');
    router.push(`/${route.params.project}/${props.item.code}/${firstPageCode}`);
  } else {
    router.push(`/${route.params.project}/${props.item.parentCode}/${pageCode.value}`);
  }
}

function scrollToTitle(title: string) {
  router.push({ ...route, hash: `#${title}` });
}
</script>

<template>
  <li>
    <a href="#" :class="{ on: active, hide: !depth && page.info?.type === 'Essential' }" @click.prevent="navigate">{{ item.label }}</a>
    <template v-if="hasChildren && open">
      <ul>
        <drawer-menu-item v-for="child in item.children" :key="child.code" :item="child" :depth="depth + 1"/>
      </ul>
    </template>

    <!-- article 목록 (depth >= 1인 페이지 아이템에만 표시) -->
    <ol v-if="depth >= 1 && active && articleList.length">
      <li v-for="row in articleList" :key="row.name">
        <a href="#" @click.prevent="scrollToTitle(row.value?.title as string)">{{ row.value?.title }}</a>
      </li>
    </ol>
  </li>
</template>