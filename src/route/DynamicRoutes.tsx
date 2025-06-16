import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { routes } from './index'
import { withAuth } from './withAuth'

const DynamicRoutes = () => {
  const renderRoutes = (routes: any[]) =>
    routes.map((route: any, index: number) => (
      <Route
        key={index}
        path={route.path}
        element={React.createElement(withAuth(route.path, route.element))}
      >
        {/*递归多层子路由*/}
        {route.children && renderRoutes(route.children)}
      </Route>
    ))

  return <Routes>{renderRoutes(routes)}</Routes>
}

export default React.memo(DynamicRoutes)
