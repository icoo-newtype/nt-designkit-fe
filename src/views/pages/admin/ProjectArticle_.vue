<script setup lang="ts">
import { computed, provide, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from '@/hooks/useInputDialog';
import { useToast } from '@/plugins/toast';
import oax from '@/utils/oax';
import { forEach, isString, map, orderBy, pick } from 'lodash-es';
import { ModuleItem } from '@/types/components';
import BButton from '@/views/components/common/BButton.vue';
import Drag from '@/views/components/article/Drag.vue';
import BRow from '@/views/components/common/BRow.vue';
import BCol from '@/views/components/common/BCol.vue';
import TextInput from '@/views/components/form/TextInput.vue';
import BFormGroup from '@/views/components/common/BFormGroup.vue';
import DropSelect from '@/views/components/form/DropSelect.vue';
import RadioButton from '@/views/components/form/RadioButton.vue';
import BInputGroup from '@/views/components/common/BInputGroup.vue';
import { useState } from '@/store/state';
import TextBox from '@/views/components/form/TextBox.vue';
import BForm from '@/views/components/common/BForm.vue';
import BCheckbox from '@/views/components/common/BCheckbox.vue';
import { usePage } from '@/store/page';
import { useAuthInfo } from '@/store/auth';
import TagSelect from '@/views/components/article/TagSelect.vue';
import { useModal } from '@/plugins/modal';
import ArticleCopyModal from '@/views/components/modal/ArticleCopyModal.vue';
import PublishModal from '@/views/components/modal/PublishModal.vue';
import ArticleSearchModal from '@/views/components/modal/ArticleSearchModal.vue';
import ModuleGroup from '@/views/components/modules/ModuleGroup.vue';
import ImageSelect from '@/views/components/form/ImageSelect.vue';
import BInputGroupPrepend from '@/views/components/common/BInputGroupPrepend.vue';
import { reloadPage } from '@/utils/routeUtil';

const code = usePage();
const state = useState();
const router = useRouter();
const { currentRoute } = useRouter();
const authInfo = useAuthInfo();

const loading = ref(false);
const apiData = reactive<Partial<ProjectItem>>({ access: 2, region: 'Local', author: authInfo?.user?.name });
const contents = ref<ModuleItem[]>([]);
const category = ref<(string | number)[]>([]);
const tags = ref();
const relatedList = ref<ProjectItem[]>([]);
const savedRelatedList = ref<ProjectItem[]>([]);
const managerList = ref<string[]>([]);

const published = computed(() => apiData.publishDtt);
const sq = computed(() => currentRoute.value.params.sq);
const codes = computed(() => code.codeList('project'));
const type = 'project';
provide('type', type);

const confirm = useConfirm();
const success = useToast({ type: 'success' });
const warning = useToast({ type: 'error' });

const copySlug = async () => {
  await navigator.clipboard.writeText(`${state.host}/projects/${apiData.slug}`);
  success('URL copied to clipboard.');
};

const getRecommendRelated = async () => {
  const { data } = await oax.get<PagingList<ProjectItem>>(`/api/project`, { perPage: 5 });
  relatedList.value = data.list;
};

const getText = (txt: string) => {
  return txt.replace(/<[^>]*>/gi, '').replace(/[\r\n]/g, ' ');
};

const findText = (str: string | any) => {
  if (isString(str)) return ' ' + getText(str);
  let result = '';
  forEach(str, (e: any) => result += findText(e));
  return result;
};
const submit = async () => {
  let search = '';
  contents.value?.forEach(item => {
    if (!item?.value) return;
    search += findText(item.value);
  });
  if (tags.value) search += tags.value.toString();

  await oax.post(`/api/admin/project`, {
    ...apiData,
    tag: tags.value, search,
    contents: btoa(encodeURIComponent(JSON.stringify(contents.value))),
    category: category.value,
    relatedList: map(relatedList.value, 'sq'),
  });
};
const validator = ref();
const validate = async () => {
  if (!validator.value?.validate()) {
    await confirm('필수 입력', '프로젝트 등록을 위해 필수 정보를 모두 입력해주세요.');
    return false;
  }
  if (!contents.value.length) {
    await confirm('필수 입력', '1개 이상의 모듈을 등록해주세요.');
    return false;
  }
  if (apiData.slug && /[`~!@#$%^&*()+[\]{}\\|=,./<>?;':"\s]+/.test(apiData.slug)) {
    await confirm('URL Slug', 'URL Slug에는 공백 및 특수문자를 포함할 수 없습니다.(-,_ 제외)');
    return false;
  }
  return true;
};
const publish = async (date: string) => {
  apiData.publishDtt = date;
  if (!await validate()) return;
  await submit();
  await confirm('발행되었습니다.');
  if (!!sq) location.reload();
  else await router.push('/admin/project/list');
};

const save = async () => {
  if (!await validate()) return;
  await submit();
  await confirm('저장되었습니다.');
  if (!!sq) location.reload();
  else await router.push('/admin/project/list');
};

const copy = async (data: ProjectItem) => {
  Object.assign(apiData, data, { sq: null, publishDtt: null });
  if (!await validate()) return;
  await submit();
  await confirm('복사되었습니다.');
  await router.push('/admin/project/list');
};
const getManagerList = async () => {
  const { data } = await oax.get<PagingList<ManagerItem>>('/api/admin/manager/list', { status: '1' });
  managerList.value = data.list.map(e => e.name);
};
const getRelatedList = async () => {
  const { data } = await oax.get<ProjectItem[]>(`/api/project/related/${sq.value}`);
  savedRelatedList.value = relatedList.value = orderBy(data.map(e => pick(e, ['sq', 'title', 'odr'])) as ProjectItem[], ['odr'], ['asc']);
};
const preview = () => {
  window.open(`${state.host}/projects/${apiData.slug}`);
};
const getData = async () => {
  loading.value = true;
  const { data } = await oax.get<ProjectItem>(`/api/admin/project/${sq.value}`);
  Object.assign(apiData, data);
  tags.value = data.tagList && data.tagList.split(',');
  category.value = data.categoryList.split(',');
  contents.value = JSON.parse(decodeURIComponent(atob(data.contents)));

  await getRelatedList();
  loading.value = false;
};

const copyModal = useModal<ProjectItem, { data: Partial<ArticleCopyItem> }>(ArticleCopyModal);
const openCopyModal = async () => {
  const copyData = await copyModal({ data: pick(apiData, ['title', 'slug']) });
  await copy(copyData);
};

const publishModal = useModal<string, { dtt?: string }>(PublishModal);
const openPublishModal = async () => {
  const dtt = await publishModal({ dtt: apiData.publishDtt });
  await publish(dtt);
};

const searchModal = useModal<any, { type: string, data: any, max?: number }>(ArticleSearchModal);
const openSearchModal = async () => {
  relatedList.value = await searchModal({ type, data: relatedList.value || [], max: 5 });
};

watch(() => apiData.title, (val) => {
  if (apiData.sq) return;
  apiData.slug = val?.replace(/([A-Z])/g, (c: string) => c.toLowerCase()).replace(/\s+/g, '-').replace(/[^ㄱ-힣\w-]/g, '');
});
reloadPage();

getManagerList();
if (sq.value) getData();
else getRecommendRelated();

</script>

<template>
  <div project-article class="article animated fadeIn" v-if="!loading">
    <div class="util-wrap">
      <b-button size="sm" variant="outline" @click="$router.push(`/admin/project/list`)">{{ sq ? '목록' : '취소' }}</b-button>
      <b-button size="sm" variant="outline" @click="openCopyModal" v-if="sq">복사</b-button>
      <b-button size="sm" variant="outline" @click="save">저장</b-button>
      <b-button size="sm" variant="outline" @click="preview" v-if="sq">미리보기</b-button>
      <b-button size="sm" :variant="published ? 'outline' : 'primary'" @click="openPublishModal">{{ published ? '발행일 수정' : '발행' }}</b-button>
    </div>
    <BForm ref="validator">
      <div class="screen-wrap">
        <div class="screen">
          <div class="hero">
            <div class="title">
              <TextBox required class="title" placeholder="Main Title" v-model="apiData.title" no-resize/>
              <TextBox class="sub-title" placeholder="Sub Title" v-model="apiData.subTitle" no-resize/>
            </div>
            <div>
              <TextBox required class="description" placeholder="내용을 입력해주세요" v-model="apiData.description" :rows="3" no-resize/>
              <ul>
                <li>
                  <BFormGroup label="G.F.A" horizontal>
                    <TextInput required placeholder="내용을 입력해주세요" v-model="apiData.gfa"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Floor" horizontal>
                    <TextInput required placeholder="내용을 입력해주세요" v-model="apiData.floor"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Year" horizontal>
                    <TextInput required type="number" max="9999" placeholder="내용을 입력해주세요" v-model="apiData.year"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Location" horizontal>
                    <TextInput required placeholder="내용을 입력해주세요" v-model="apiData.location"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Client" horizontal>
                    <TextInput placeholder="내용을 입력해주세요" v-model="apiData.client"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Consortium" horizontal>
                    <TextInput placeholder="내용을 입력해주세요" v-model="apiData.consortium"/>
                  </BFormGroup>
                </li>
                <li>
                  <BFormGroup label="Awards" horizontal>
                    <TextBox placeholder="내용을 입력해주세요" v-model="apiData.awards" no-resize/>
                  </BFormGroup>
                </li>
              </ul>
            </div>
          </div>
          <div class="body">
            <ImageSelect required message="Main Image" :filekey="type" v-model="apiData.kvImage"/>
            <ModuleGroup v-model="contents"/>
            <div class="credits">
              <p>Credits</p>
              <TextBox placeholder="내용을 입력해주세요" v-model="apiData.credits" no-resize/>
            </div>
          </div>
        </div>
      </div>
      <div class="info-section">
        <h2>기본 정보</h2>
        <b-row>
          <b-col cols="6">
            <BFormGroup label="카테고리 분류" class="category">
              <div v-for="row in codes" :key="row.value" class="category-row" :class="{ invalid: !category.length }">
                <p>{{ row.label }}</p>
                <b-checkbox type="square" v-model="category" :label="item.label" :value="item.value" v-for="item in code.codeList(row.value)"/>
              </div>
            </BFormGroup>
            <div class="d-flex">
              <BFormGroup label="작성자" class="mr-5">
                <DropSelect :list="managerList" v-model="apiData.author" class="w-150" v-if="managerList.length"/>
              </BFormGroup>
              <BFormGroup label="공개 설정" class="mr-5">
                <RadioButton v-model="apiData.access" :list="[{ value: 1, label: '전체공개' }, { value: 2, label: '비공개' }]"/>
              </BFormGroup>
              <BFormGroup label="Region">
                <RadioButton v-model="apiData.region" :list="['Local', 'Global']"/>
              </BFormGroup>
            </div>
            <BFormGroup label="연관 콘텐츠" class="related-contents">
              <Drag class="related-list" v-model="relatedList">
                <div class="list-group-item" v-for="(element,i) in relatedList" :key="i">
                  <i class="bi-list handle mr-1"></i>
                  {{ element.title }}
                  <i class="bi-x-circle-fill handle x-btn text-black-50" @click="relatedList.splice(i,1)"></i>
                </div>
              </Drag>
              <b-button v-if="relatedList.length < 5" variant="outline" class="block wf mt-1" @click="openSearchModal">
                <i class="bi-plus-circle-fill text-black-50"></i>
              </b-button>
            </BFormGroup>
            <BFormGroup label="URL Slug" class="url-slug">
              <b-input-group>
                <b-input-group-prepend class="pr-2">
                  {{ `${state.host}/projects/` }}
                </b-input-group-prepend>
                <TextInput required v-model="apiData.slug" placeholder="URL Slug를 입력해 주세요"/>
                <b-button class="ml-2" @click="copySlug" v-if="apiData.slug">복사하기</b-button>
              </b-input-group>
            </BFormGroup>
          </b-col>
          <b-col cols="6">
            <BFormGroup label="대표 이미지">
              <ImageSelect required :filekey="type" v-model="apiData.thumbImage"/>
              <p class="caution">권장 이미지 크기 1728 x 972</p>
            </BFormGroup>
            <BFormGroup label="태그">
              <TagSelect v-model="tags"/>
            </BFormGroup>
          </b-col>
        </b-row>
      </div>
    </BForm>
  </div>
</template>

<style lang="less">
@import '~@/less/proj.less';

[project-article] {
  .screen-wrap { .tc; .p(50, 40); .max-w(1440); .mh-c; }
  .screen { .ib; .rel; .p(50, 40, 100); .wf; .-a(#EAEAEA);
    .hero { .flex; .space-between;
      .title + div { .w(690); }
      .col-form-label { .tl; .medium; }
      .form-control { background: none; .ph(0); .medium; .c(#111); .-a(transparent);
        &:focus { .c(#666); .-a(transparent); }
      }
      .title, .sub-title { .fs(38, 1.2); }
      .sub-title { .c(#B2B2B2);
        &::placeholder { .c(#B2B2B2); }
      }
      .description { .fs(16, 1.5); }
      ul { .mv(60); .grid(2); .-t(#EAEAEA);
        li { .pv(7); .-b(#EAEAEA);
          .form-group { .m; }
          .col-form-label { .w(90); .c(#999); }
        }
        li:nth-child(7) { grid-column: span 2; }
      }
    }
    .body { .pb(100);
      .hero { .p(20, 0);
        .title { .w(620); .mh-c; .fs(48, 1); color: #1e1e1e; .bold; .p; }
      }
      .modules { .mt(60); }
      .f-add { .mh(0); .tc; .mt(36);
        &:before { .cnt; .h(1); background: #111; }
        .btn {.rel; .p(5, 21); .br-b(4); .bold; z-index: 2;}
      }
      .credits { .mt(120); .tc;
        p { .fs(18, 1.6); .medium; }
        .form-control { .mt(8); .tc }
      }
    }
  }
  .info-section { .p(0, 46); .mt(50);
    h2 { .fs(24); .bold; .mb(20); }
    .category {
      .category-row { .bgc(#F7F7F7); .-a(#F7F7F7); .p(20, 20, 18);
        p { .fs(14, 1); .semi-bold; }
        [b-checkbox] { .ib; .mt(8); .mr(16); }
        & + div { .mt(12); }
      }
    }
    .input-section, .file-section {.w(50%); .ib; .vat;}
    .file-section {.pl(30);}
    [image-select] {height: auto; .min-h(300);}

    .form-group { .mb(36);
      .col-form-label { .fs(16, 1); .bold; .mb(4); }
      .count { color: #898989; .tr; .fs(12); .mt(4);
        p { .m(0);
          span { .ib; .p(0, 2); }
        }
      }
      &.related-contents {
        .related-list {.mb(4);
          .list-group-item {.p(10, 15); .rel;
            .handle {.mr(5);}
            .x-btn {.abs; .rt(10, 12); cursor: pointer;}
          }
        }
      }
    }
  }
  .validated .category-row.invalid { .border-danger; }
}

</style>
