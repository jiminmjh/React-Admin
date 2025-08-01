import { createRoot } from 'react-dom/client'
import './styles/index.less'
import App from './App.tsx'
import { store, persistor } from '@/stores'
import { Provider, useSelector } from 'react-redux'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider, theme } from 'antd'
/* 清除浏览器默认样式 */
import 'normalize.css'
import { PersistGate } from 'redux-persist/integration/react'
import { RootState } from '@/stores'

function ThemedApp() {
  const { isDarkMode } = useSelector((state: RootState) => state.user)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#2c3142' : '#1677ff',
          colorBgContainer: isDarkMode ? '#2c3142' : '#ffffff',
          colorBgLayout: isDarkMode ? '#2c3142' : '#f7f7f7',
          colorBgElevated: isDarkMode ? '#2c3142' : '#ffffff',
          colorText: isDarkMode ? '#ffffff' : '#000000'
        }
      }}>
      {/* PersistGate 确保在恢复状态后再渲染 UI */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemedApp />
  </Provider>
)
