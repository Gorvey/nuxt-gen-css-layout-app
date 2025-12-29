<script setup lang="ts">
/**
 * 页面列表面板组件
 * 提供页面列表的展示、创建、切换和删除功能
 */

import { usePagesStore } from '~/stores/pages'

/** 页面 Store */
const pagesStore = usePagesStore()

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
</script>

<template>
  <ClientOnly>
    <div class="p-4">
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
  </ClientOnly>
</template>
