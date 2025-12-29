/**
 * 页面状态管理 Store
 * 管理多页面及每个页面的编辑器配置
 */

import { nanoid } from 'nanoid'
import type { DSLNode } from '~/types/dsl'

/**
 * 页面数据结构
 */
export interface Page {
  /** 页面 ID */
  id: string
  /** 页面名称 */
  name: string
  /** 编辑器宽度 */
  editorWidth: number
  /** 编辑器高度 */
  editorHeight: number
  /** 根节点 ID */
  rootId: string | null
}

/**
 * 页面 Store 状态
 */
export const usePagesStore = defineStore('pages', () => {
  /** 页面列表 */
  const pages = ref<Page[]>([
    {
      id: 'default',
      name: '页面 1',
      editorWidth: 600,
      editorHeight: 500,
      rootId: null,
    },
  ])

  /** 当前激活的页面 ID */
  const activePageId = ref<string>('default')

  /** 当前激活的页面 */
  const activePage = computed(() => pages.value.find((page) => page.id === activePageId.value))

  /**
   * 创建新页面
   * @param name - 页面名称
   * @returns 新创建的页面
   */
  const createPage = (name: string = `页面 ${pages.value.length + 1}`): Page => {
    const newPage: Page = {
      id: nanoid(),
      name,
      editorWidth: 600,
      editorHeight: 500,
      rootId: null,
    }
    pages.value.push(newPage)
    return newPage
  }

  /**
   * 删除页面
   * @param pageId - 页面 ID
   */
  const deletePage = (pageId: string) => {
    const index = pages.value.findIndex((page) => page.id === pageId)
    if (index > -1 && pages.value.length > 1) {
      pages.value.splice(index, 1)
      // 如果删除的是当前激活页面，切换到第一个页面
      if (activePageId.value === pageId) {
        activePageId.value = pages.value[0].id
      }
    }
  }

  /**
   * 切换激活页面
   * @param pageId - 页面 ID
   */
  const setActivePage = (pageId: string) => {
    const page = pages.value.find((p) => p.id === pageId)
    if (page) {
      activePageId.value = pageId
    }
  }

  /**
   * 更新页面名称
   * @param pageId - 页面 ID
   * @param name - 新名称
   */
  const updatePageName = (pageId: string, name: string) => {
    const page = pages.value.find((p) => p.id === pageId)
    if (page) {
      page.name = name
    }
  }

  /**
   * 设置页面编辑器宽度
   * @param pageId - 页面 ID
   * @param width - 宽度值
   */
  const setEditorWidth = (pageId: string, width: number) => {
    const page = pages.value.find((p) => p.id === pageId)
    if (page) {
      page.editorWidth = width
    }
  }

  /**
   * 设置页面编辑器高度
   * @param pageId - 页面 ID
   * @param height - 高度值
   */
  const setEditorHeight = (pageId: string, height: number) => {
    const page = pages.value.find((p) => p.id === pageId)
    if (page) {
      page.editorHeight = height
    }
  }

  /**
   * 设置当前页面编辑器宽度
   * @param width - 宽度值
   */
  const setCurrentEditorWidth = (width: number) => {
    if (activePage.value) {
      activePage.value.editorWidth = width
    }
  }

  /**
   * 设置当前页面编辑器高度
   * @param height - 高度值
   */
  const setCurrentEditorHeight = (height: number) => {
    if (activePage.value) {
      activePage.value.editorHeight = height
    }
  }

  /**
   * 设置页面根节点 ID
   * @param pageId - 页面 ID
   * @param rootId - 根节点 ID
   */
  const setRootId = (pageId: string, rootId: string | null) => {
    const page = pages.value.find((p) => p.id === pageId)
    if (page) {
      page.rootId = rootId
    }
  }

  return {
    pages,
    activePageId,
    activePage,
    createPage,
    deletePage,
    setActivePage,
    updatePageName,
    setEditorWidth,
    setEditorHeight,
    setCurrentEditorWidth,
    setCurrentEditorHeight,
    setRootId,
  }
})

/**
 * 页面 Store 类型导出
 */
export type PagesStore = ReturnType<typeof usePagesStore>
