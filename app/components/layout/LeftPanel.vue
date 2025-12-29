<script setup lang="ts">
/**
 * 左侧面板组件
 * 包含组件库拖拽面板和组件树两个标签页
 */
import { VueDraggable } from 'vue-draggable-plus'
import { DRAGGABLE_CONTAINERS, DRAGGABLE_ELEMENTS } from '~/constants/presets'

/** 可拖拽容器列表 */
const containers = ref([...DRAGGABLE_CONTAINERS])

/** 元素列表 */
const elements = ref([...DRAGGABLE_ELEMENTS])

/** 当前激活的标签页 */
const activeTab = ref('components')

/** 标签页配置 */
const tabs = [
  { label: '组件库', icon: 'i-heroicons-cube', value: 'components' },
  { label: '组件树', icon: 'i-heroicons-squares-2x2', value: 'tree' }
]

/**
 * 克隆容器节点
 * @param item - 容器类型
 */
function cloneContainer(item: typeof DRAGGABLE_CONTAINERS[number]) {
  const { createContainerNode } = useEditor()
  return createContainerNode(item.type)
}

/**
 * 克隆元素节点
 * @param item - 元素类型
 */
function cloneElement(item: typeof DRAGGABLE_ELEMENTS[number]) {
  const { createElementNode } = useEditor()
  return createElementNode(item.type)
}
</script>

<template>
  <aside class="border-r border-default bg-elevated flex flex-col h-full">
    <!-- 标签页导航 -->
    <div class="border-b border-default">
      <UTabs v-model="activeTab" :items="tabs" color="neutral" variant="link" :ui="{ list: 'px-2' }" />
    </div>

    <!-- 标签页内容 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 组件库面板 -->
      <div v-if="activeTab === 'components'" class="p-4 space-y-6">
        <!-- 容器（可拖拽） -->
        <div>
          <h3 class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            容器
          </h3>
          <VueDraggable
            v-model="containers"
            :group="{ name: 'editor', pull: 'clone', put: false }"
            :sort="false"
            :clone="cloneContainer"
            class="grid grid-cols-2 gap-2"
          >
            <PanelDraggableItem
              v-for="item in containers"
              :key="item.type"
              :icon="item.icon"
              :label="item.label"
            />
          </VueDraggable>
        </div>

        <!-- 元素 -->
        <div>
          <h3 class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            元素
          </h3>
          <VueDraggable
            v-model="elements"
            :group="{ name: 'editor', pull: 'clone', put: false }"
            :sort="false"
            :clone="cloneElement"
            class="grid grid-cols-2 gap-2"
          >
            <PanelDraggableItem
              v-for="item in elements"
              :key="item.type"
              :icon="item.icon"
              :label="item.label"
            />
          </VueDraggable>
        </div>
      </div>

      <!-- 组件树 -->
      <div v-else class="p-4">
        <PanelComponentTree />
      </div>
    </div>
  </aside>
</template>
