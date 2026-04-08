import { createRouter, createWebHistory } from 'vue-router';
import routerTable from '@/router/routerTable';
import NotFound from '@/views/error/404.vue';
import Forbidden from '@/views/error/403.vue';
import DefaultContainer from '@/views/containers/DefaultContainer.vue';
import Login from '@/views/pages/admin/Login.vue';
import Password from '@/views/pages/admin/Password.vue';
import { FilterCondition, filterMap, PermitAll } from '@/data/filterMap';
import { forEach } from 'lodash-es';
import { useState } from '@/store/state';
import { useAuthInfo } from '@/store/auth';
import oax from '@/utils/oax';
import { PageResponse, usePage } from '@/store/page';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 };
  },
  routes: [
    {
      path: '/admin',
      component: DefaultContainer,
      redirect: '/admin/project/list',
      children: routerTable,
    },
    { path: '/admin/login', component: Login },
    { path: '/admin/password', component: Password },
    { path: '/admin/403', component: Forbidden },
    {
      path: '/:project/:category?/:page?',
      component: () => import('@/views/pages/page.vue'),
      beforeEnter: async (to, from, next) => {
        const { project: projectSlug, category, page: pageName } = to.params;
        const pageStore = usePage();

        try {
          // 프로젝트 정보 & 페이지 목록 로드 (slug가 바뀔 때마다 갱신)
          if (pageStore.info?.slug !== projectSlug) {
            const { data: projectData } = await oax.get<ProjectItem>(`/api/project/${projectSlug}`);
            if (!projectData) return next({ path: '/404' });
            projectData.resource = JSON.parse(decodeURIComponent(atob(projectData.resource as string)));
            pageStore.setInfo(projectData);

            const { data: codes } = await oax.get<PageResponse[]>(`/api/code/${projectData.sq}`);
            pageStore.setCodes(codes);
          }

          // category / page 없으면 첫 번째 페이지로 리다이렉트
          if (!category || !pageName) {
            const first = category
              ? pageStore.codes.find(c => c.parentCode === category)  // category 있으면 해당 카테고리의 첫 번째
              : pageStore.codes[0];                                    // 없으면 전체 첫 번째

            if (first) {
              const pageCode = first.code.replace(`${first.parentCode}-`, '');
              return next(`/${projectSlug}/${first.parentCode}/${pageCode}`);
            }
          }

          // category / pageName이 codes에 존재하는지 검증
          const exists = pageStore.codes.some(
            c => c.parentCode === category && c.code === `${category}-${pageName}`
          );
          if (!exists) return next({ path: '/404' });

          // 현재 페이지 활성화
          pageStore.setCurrent(`${category}-${pageName}`);

        } catch (e) {
          console.error('beforeEnter failed:', e);
          return next({ path: '/404' });
        }

        next();
      },
    },
    { path: '/404', component: NotFound },
    { path: '/:pathMatch(.*)', component: NotFound, name: 'NotFound' },
  ],
});

router.beforeEach((to, from, next) => {
  const state = useState();
  const auth = useAuthInfo();
  const roles = auth.user?.roles;

  let redirect: string | null = null;

  forEach(filterMap, (condition: FilterCondition) => {
    if (!condition.exp.test(to.path)) return true;        // 해당 규칙 없음, 계속
    if (condition.access === PermitAll) return false;     // 전체 허용, 통과

    if (!roles) {
      state.afterLogin = to.path;
      redirect = '/admin/login';
      return false;
    }

    if (!condition.access(roles)) {
      redirect = '/admin/403';
      return false;
    }

    return false;
  });

  next(redirect ?? undefined);
});

export default router;