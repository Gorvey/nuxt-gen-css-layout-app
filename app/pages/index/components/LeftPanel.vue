<script setup lang="ts">
import { ref } from 'vue'
import PageListPanel from './panel/PageListPanel.vue'
import ComponentLibraryPanel from './panel/ComponentLibraryPanel.vue'
import ComponentTreePanel from './panel/ComponentTreePanel.vue'

/**
 * 左侧面板组件
 * 包含页面、组件库和组件树三个标签页
 */

/** 当前激活的标签页 */
const activeTab = ref('pages')

/** 标签页配置 */
const tabs = [
  { label: '页面', icon: 'i-heroicons-document', value: 'pages' },
  { label: '组件库', icon: 'i-heroicons-cube', value: 'components' },
  { label: '组件树', icon: 'i-heroicons-squares-2x2', value: 'tree' },
]
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
      <PageListPanel v-if="activeTab === 'pages'" />

      <!-- 组件库面板 -->
      <ComponentLibraryPanel v-else-if="activeTab === 'components'" />

      <!-- 组件树面板 -->
      <ComponentTreePanel v-else />
    </div>
  </aside>
</template>
