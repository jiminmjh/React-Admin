import cloneDeep from 'lodash/cloneDeep'
import { IRouteObj } from '@/types/user'

/**
 * 菜单列表转树形
 */
export function deepTree(list: any[]) {
  if (!Array.isArray(list) || list.length === 0) {
    return []
  }
  // 第一步：去重 - 基于菜单名和路由去重
  const uniqueMap = new Map()
  const uniqueList = list.filter(item => {
    if (!item || !item.id || !item.name) return false
    // 创建唯一键：菜单名 + 路由
    const key = `${item.name}-${item.router || ''}`
    if (uniqueMap.has(key)) {
      return false // 已存在，过滤掉
    } else {
      uniqueMap.set(key, true)
      return true // 保留
    }
  })

  const map: any = {}
  const result: any[] = []
  // 第二步：创建映射表
  uniqueList.forEach(item => {
    if (item && item.id !== undefined) {
      map[item.id] = { ...item }
    }
  })
  // 第三步：构建树形结构
  uniqueList.forEach(item => {
    if (item && item.id !== undefined) {
      if (item.parentId && map[item.parentId]) {
        if (map[item.parentId].children) {
          map[item.parentId].children.push(map[item.id])
        } else {
          map[item.parentId].children = [map[item.id]]
        }
      } else {
        result.push(map[item.id])
      }
    }
  })
  return result
}

/**
 * 点击菜单栏 -- 历史路径数据 标签高亮处理 LayoutHead
 */

export function getClickMenuTags(tags: Partial<IRouteObj>[], obj: Partial<IRouteObj> = {}) {
  // 是否增加历史纪录标签
  let arr = cloneDeep(tags)
  const flag = tags.find(e => e.id === obj.id)
  if (flag) {
    arr = arr.map(e => {
      e.active = e.id === flag.id
      return e
    })
  } else {
    arr = arr.map(e => ({ ...e, active: false }))
    ;(obj = { ...obj, active: true }) && arr.push(obj)
  }
  return arr
}
