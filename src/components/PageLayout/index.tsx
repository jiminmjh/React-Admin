import React, { ReactNode, CSSProperties } from 'react'
import { theme } from 'antd'
import './index.less'

// todo后期可添加搜索区域，table区域 ，分页区域
interface PageLayoutProps {
  /** 页面自定义类名 */
  pageClass?: string
  /** 页面自定义样式 */
  pageStyle?: CSSProperties
  /** 主体内容 */
  children?: ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageClass = '', pageStyle = { minWidth: '800px' }, children }) => {
  const { token } = theme.useToken()
  const defaultPageStyle: CSSProperties = {
    background: token.colorBgLayout,
    minWidth: '800px',
    ...pageStyle
  }

  return (
    <div className={`page-layout-page ${pageClass}`} style={defaultPageStyle}>
      <div className='content-wrapper'>{children}</div>
    </div>
  )
}

export default PageLayout
