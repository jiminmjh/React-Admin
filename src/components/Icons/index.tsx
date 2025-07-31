import React from 'react'
import {
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  DropboxOutlined,
  StarOutlined,
  StarFilled,
  BookOutlined,
  FileOutlined,
  FolderOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons'

// 图标映射表
const iconMap = {
  'icon-favor': HeartOutlined,
  'icon-favor-filled': HeartFilled,
  'icon-delete': DeleteOutlined,
  'icon-dropbox': DropboxOutlined,
  'icon-star': StarOutlined,
  'icon-star-filled': StarFilled,
  'icon-book': BookOutlined,
  'icon-file': FileOutlined,
  'icon-folder': FolderOutlined,
  'icon-setting': SettingOutlined,
  'icon-user': UserOutlined,
  'icon-team': TeamOutlined
}

const IconRenderer = ({ iconName, onClick = () => {}, style = {}, className = '', ...props }) => {
  const IconComponent = iconMap[iconName] ?? FolderOutlined

  if (!IconComponent) {
    console.warn(`Icon not found: ${iconName}`)
    return null
  }

  return <IconComponent onClick={onClick} style={style} className={className} {...props} />
}

export default IconRenderer
