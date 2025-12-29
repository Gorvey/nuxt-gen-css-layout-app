<script setup lang="ts">
/**
 * 左侧面板组件
 * 包含组件库拖拽面板和组件树两个标签页
 */

/** 当前激活的标签页 */
const activeTab = ref('components')

/** 标签页配置 */
const tabs = [
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
      <!-- 组件库面板 -->
      <div v-if="activeTab === 'components'" class="p-4">
        <!-- TODO: 添加可拖拽容器和元素 -->
        <p class="text-sm text-muted">组件库</p>
      </div>

      <!-- 组件树 -->
      <div v-else class="p-4">
        <!-- TODO: 添加组件树 -->
        <p class="text-sm text-muted">组件树</p>
      </div>
    </div>
  </aside>
</template>
