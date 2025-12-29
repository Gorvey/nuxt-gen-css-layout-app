<script setup lang="ts">
/**
 * 左侧面板组件
 * 包含页面、组件库和组件树三个标签页
 */

import { usePagesStore } from '~/stores/pages'

/** 页面 Store */
const pagesStore = usePagesStore()

/** 当前激活的标签页 */
const activeTab = ref('pages')

/** 标签页配置 */
const tabs = [
  { label: '页面', icon: 'i-heroicons-document', value: 'pages' },
  { label: '组件库', icon: 'i-heroicons-cube', value: 'components' },
  { label: '组件树', icon: 'i-heroicons-squares-2x2', value: 'tree' },
]

/** 新页面名称输入框显示状态 */
const showNewPageInput = ref(false)

/** 新页面名称 */
const newPageName = ref('')

/**
 * 创建新页面
 */
const handleCreatePage = () => {
  if (newPageName.value.trim()) {
    pagesStore.createPage(newPageName.value.trim())
    newPageName.value = ''
    showNewPageInput.value = false
  }
}

/**
 * 取消创建页面
 */
const handleCancelCreate = () => {
  newPageName.value = ''
  showNewPageInput.value = false
}

/**
 * 删除页面
 * @param pageId - 页面 ID
 * @param event - 事件对象
 */
const handleDeletePage = (pageId: string, event: Event) => {
  event.stopPropagation()
  if (pagesStore.pages.length > 1) {
    pagesStore.deletePage(pageId)
  }
}

/**
 * 切换到页面编辑模式
 * @param page - 页面对象
 */
const startEditPageName = (page: { id: string; name: string }) => {
  // TODO: 实现页面名称编辑功能
}
</script>

<template>
  <aside class="border-r border-default bg-elevated flex flex-col h-full">
    <!-- 标签页导航 -->
    <div class="border-b border-default">
      <UTabs
        v-model="activeTab"
        :items="tabs"
        color="neutral"
        variant="link"
        :ui="{ list: 'px-2' }"
      />
    </div>

    <!-- 标签页内容 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 页面列表面板 -->
      <div v-if="activeTab === 'pages'" class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium">页面列表</h3>
          <UButton
            icon="i-heroicons-plus"
            size="xs"
            variant="soft"
            @click="showNewPageInput = true"
          />
        </div>

        <!-- 新页面输入框 -->
        <div v-if="showNewPageInput" class="mb-3">
          <UInput
            v-model="newPageName"
            placeholder="输入页面名称"
            size="sm"
            autofocus
            @keydown.enter="handleCreatePage"
            @keydown.esc="handleCancelCreate"
          >
            <template #trailing>
              <UButton
                icon="i-heroicons-check"
                size="xs"
                color="primary"
                variant="ghost"
                @click="handleCreatePage"
              />
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="handleCancelCreate"
              />
            </template>
          </UInput>
        </div>

        <!-- 页面列表 -->
        <div class="space-y-1">
          <div
            v-for="page in pagesStore.pages"
            :key="page.id"
            class="group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors"
            :class="[
              pagesStore.activePageId === page.id
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                : 'hover:bg-default',
            ]"
            @click="pagesStore.setActivePage(page.id)"
          >
            <span class="flex-1 text-sm truncate">{{ page.name }}</span>
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="pagesStore.pages.length <= 1"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="handleDeletePage(page.id, $event)"
            />
          </div>
        </div>
      </div>

      <!-- 组件库面板 -->
      <div v-else-if="activeTab === 'components'" class="p-4">
        <!-- TODO: 添加可拖拽容器和元素 -->
        <p class="text-sm text-muted">组件库</p>
      </div>

      <!-- 组件树面板 -->
      <div v-else class="p-4">
        <!-- TODO: 添加组件树 -->
        <p class="text-sm text-muted">组件树</p>
      </div>
    </div>
  </aside>
</template>
