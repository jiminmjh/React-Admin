import React from 'react'
import { iconfontUrl } from '@/comom/constants'
import { createFromIconfontCN } from '@ant-design/icons'

// 判断是否为开发环境
const isDev = import.meta.env.VITE_ENV === 'dev'

// 创建图标组件
const IconFont = createFromIconfontCN({
  scriptUrl: isDev
    ? [
        iconfontUrl // 开发环境：仅使用在线链接
      ]
    : [
        '/assets/iconfont/iconfont.js', // 生产环境：本地文件优先
        iconfontUrl // 备份：在线链接
      ]
})

interface IconProps {
  name: string
  onClick?: () => void
  style?: React.CSSProperties
  className?: string
  size?: number | string
  color?: string
  [key: string]: any
}

const RenderAliIcon: React.FC<IconProps> = ({
  name,
  onClick,
  style = {},
  className = '',
  size = 16,
  color = '#fff',
  ...props
}) => {
  console.log('==name', name, 'isDev:', isDev)

  const iconStyle: React.CSSProperties = {
    ...style,
    ...(size && { fontSize: size })
  }

  return (
    <IconFont type={name} onClick={onClick} style={iconStyle} className={`render-ali-icon ${className}`} {...props} />
  )
}

export default RenderAliIcon
