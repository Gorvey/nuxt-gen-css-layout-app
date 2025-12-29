<script setup lang="ts">
/**
 * 左侧拖拽面板组件
 */
import { VueDraggable } from 'vue-draggable-plus'
import { DRAGGABLE_CONTAINERS, DRAGGABLE_ELEMENTS, ROOT_LAYOUT_TYPES } from '~/constants/presets'
import type { ContainerLayout } from '~/types/dsl'

const { changeRootContainerType, rootContainer } = useEditor()

/** Root 布局类型列表 */
const rootLayouts = ref([...ROOT_LAYOUT_TYPES])

/** 可拖拽容器列表 */
const containers = ref([...DRAGGABLE_CONTAINERS])

/** 元素列表 */
const elements = ref([...DRAGGABLE_ELEMENTS])

/**
 * 点击 Root 布局切换类型
 * @param layout - 布局类型
 */
function handleClickRootLayout(layout: ContainerLayout) {
  changeRootContainerType(layout)
}

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

/** 当前 Root 容器类型 */
const activeRootLayout = computed(() => rootContainer.value.layout)
</script>

<template>
  <aside class="border-r border-default bg-elevated overflow-y-auto">
    <div class="p-4 space-y-6">
      <!-- Root 布局 -->
      <div>
        <h3 class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Root 布局
        </h3>
        <div class="space-y-2">
          <PanelDraggableItem
            v-for="item in rootLayouts"
            :key="item.type"
            :icon="item.icon"
            :label="item.label"
            :is-active="activeRootLayout === item.type"
            @click="handleClickRootLayout(item.type)"
          />
        </div>
      </div>

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
          class="space-y-2"
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
          class="space-y-2"
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
  </aside>
</template>
