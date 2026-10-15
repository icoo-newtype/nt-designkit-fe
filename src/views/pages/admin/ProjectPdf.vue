<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import oax from '@/utils/oax';
import { enterToBr } from '@/utils';
import { PageResponse } from '@/store/page';
import { ModuleItem } from '@/types/components';
import CdnImg from '@/views/components/CdnImg.vue';
import BButton from '@/views/components/common/BButton.vue';

// 가로형 모듈(Cover, Detail)만 모아서 1920x1080 한 장씩 출력 → 브라우저 인쇄로 PDF 저장
const PDF_COMPS = ['Cover', 'Detail'];

const route = useRoute();
const loading = ref(true);
const printing = ref(false);
const project = ref<ProjectItem>();
const slides = ref<(ModuleItem & { value: Record<string, any>, pageLabel: string })[]>([]);
const pagesEl = ref<HTMLElement>();

const hasText = (text: string): boolean => !!text && text.replace(/<[^>]*>/g, '').trim().length > 0;

// 사이트 메뉴(LNB)와 같은 순서로 페이지를 펼친다
const flattenPages = (rows: PageResponse[], parentCode = 'ROOT'): PageResponse[] => rows
  .filter(row => row.parentCode === parentCode)
  .sort((a, b) => a.odr - b.odr)
  .flatMap(row => [row, ...flattenPages(rows, row.code)]);

const load = async () => {
  const { data: info } = await oax.get<ProjectItem>(`/api/admin/project/${route.params.sq}`);
  project.value = info;
  document.title = `${info.title}_guide`;

  const { data: codes } = await oax.get<PageResponse[]>(`/api/code/${info.sq}`);
  slides.value = flattenPages(codes).flatMap(page => {
    if (!page.article) return [];
    const article = JSON.parse(decodeURIComponent(atob(page.article))) as ModuleItem[];
    return article
      .filter(item => PDF_COMPS.includes(item.comp) && item.value)
      .map(item => ({ ...item, value: item.value as Record<string, any>, pageLabel: page.label }));
  });
  loading.value = false;
};

const waitImages = async () => {
  await nextTick();
  const images = Array.from(pagesEl.value?.querySelectorAll('img') ?? []);
  await Promise.all(images.map(img => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined))));
};

const save = async () => {
  printing.value = true;
  try {
    await waitImages();
    window.print();
  } finally {
    printing.value = false;
  }
};

const count = computed(() => slides.value.length);

load();
</script>

<template>
  <div project-pdf>
    <div class="toolbar">
      <div>
        <p class="name">{{ project?.title }} · PDF</p>
        <p class="guide" v-if="!loading">
          가로형 모듈(Cover, Detail) {{ count }}개가 한 장씩 출력됩니다.
          인쇄 창에서 대상을 <b>'PDF로 저장'</b>으로 선택하고, 설정의 <b>'배경 그래픽'</b>을 켜주세요.
        </p>
      </div>
      <b-button variant="primary" @click="save" :disabled="loading || printing || !count">PDF 저장</b-button>
    </div>

    <p class="empty" v-if="!loading && !count">PDF로 출력할 가로형 모듈(Cover, Detail)이 없습니다.</p>

    <div class="pages" ref="pagesEl">
      <template v-for="(slide, i) in slides" :key="i">
        <section v-if="slide.comp === 'Cover'" class="pdf-page cover" :style="{ backgroundColor: slide.value.bgColor }">
          <p class="title" v-html="enterToBr(slide.value.title)"></p>
          <div class="text" v-html="slide.value.text" v-if="hasText(slide.value.text)"></div>
          <p class="caption" v-html="enterToBr(slide.value.caption)" v-if="slide.value.caption"></p>
        </section>
        <section v-else class="pdf-page detail">
          <div class="text">
            <p class="title" v-html="enterToBr(slide.value.title)"></p>
            <div v-html="slide.value.text" v-if="hasText(slide.value.text)"></div>
          </div>
          <div class="visual">
            <div class="view">
              <cdn-img :src="slide.value.media" v-if="slide.value.media"/>
            </div>
            <p class="caption" v-html="enterToBr(slide.value.caption)" v-if="slide.value.caption"></p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

@page { size: 1920px 1080px; margin: 0; }

[project-pdf] { .min-h(100vh); .bgc(#E9EBEE); .pb(60);
  .toolbar { .sticky; .t(0); z-index: 10; .flex; .space-between; .items-center; .p(16, 40); .bgc(#fff); .-b(#E7E7E7);
    .name { .fs(18); .bold; }
    .guide { .mt(4); .fs(13, 1.5); .c(#666); }
  }
  .empty { .mt(80); .tc; .fs(16); .c(#898989); }
  .pages { .flex; .flex-column; .items-center; gap: 30px; .pt(30); zoom: 0.5; }

  .pdf-page { .rel; width: 1920px; height: 1080px; .-box; .crop; .bgc(#fff); .c(#111); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    .caption { .fs(20, 1.4); .c(#666); }
  }

  // 사이트 fe-cover(PC: 카드 폭 1160px 기준 title 76 / text 26 / 간격 60 / 패딩 60)를 1920px 페이지에 같은 비율로 확대
  @cover-scale: (1920 / 1160);
  .cover { .flex; .flex-column; .justify-center; padding: 0 unit(round(60 * @cover-scale), px);
    .title { font-size: unit(round(76 * @cover-scale), px); line-height: 1.1; font-weight: 400; letter-spacing: -0.02em; text-transform: capitalize; }
    .text { margin-top: unit(round(60 * @cover-scale), px); font-size: unit(round(26 * @cover-scale), px); line-height: 1.5; .medium; letter-spacing: -0.05em; }
    .caption { .abs; left: unit(round(60 * @cover-scale), px); bottom: 60px; }
  }

  .detail { .grid; grid-template-columns: 3fr 7fr; gap: 80px; .p(120, 120);
    .title { .fs(56, 1.25); .medium; }
    .title + div { .mt(32); .fs(24, 1.7); }
    .view { aspect-ratio: 16 / 9; .br(16); .crop; .bgc(#F7F7F7);
      img { .block; .wh(100%); object-fit: contain; }
    }
    .caption { .mt(16); }
  }
}

@media print {
  [project-pdf] { .bgc(#fff); .p(0); .min-h(0);
    .toolbar, .empty { .hide; }
    .pages { display: block; .p(0); zoom: 1; }
    .pdf-page { box-shadow: none; break-after: page; page-break-after: always; }
    .pdf-page:last-child { break-after: auto; page-break-after: auto; }
  }
}
</style>
