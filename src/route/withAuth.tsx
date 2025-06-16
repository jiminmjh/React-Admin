// withAuth.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores'
import storage from '@/utils/storage'
import { NoRoleRoute } from './index'

export const withAuth = (path: string, Component: JSX.Element) => {
  return () => {
    // 如果是无需权限的路由，直接渲染
    if (NoRoleRoute.includes(path) && path !== '/') {
      return Component
    }
    const { menus } = useSelector((state: RootState) => state.user)
    let userRoles = menus
      .map(e => {
        if (e.type != 2) return e.router
      })
      .filter(e => e)
    // 未登录跳转到登录页
    const isAuthenticated = !!storage.get('token')
    if (!isAuthenticated) return <Navigate to="/login" />
    // 权限校验
    if (path == '/') return Component
    if (![...NoRoleRoute, ...userRoles].includes(path)) return <Navigate to="/403" />
  }
}
