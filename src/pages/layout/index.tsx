import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import styles from './index.module.less'
import LayoutHeader from './components/LayoutHeader'
import { menuMaxWidth } from '@/comom/readonly'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/stores'
import { deepTree, getClickMenuTags } from '@/utils'
import { DropboxOutlined } from '@ant-design/icons'
import { setTags } from '@/stores/user.ts'
import cloneDeep from 'lodash/cloneDeep'
import IconRenderer from '@/components/Icons'

const { Header, Content, Footer, Sider } = Layout

const LayoutPage: React.FC = () => {
  const navigator = useNavigate()
  const [menuList, setMenuList] = useState([])
  const [sideWidth, setSideWidth] = useState(menuMaxWidth)
  const activeMenu = useRef<number>(0) // 当前高亮菜单id
  const historyList = useRef<number[]>([]) //存储高亮纪录，方便回退
  const [openKeys, setOpenKeys] = useState<string[]>([]) // 控制展开的子菜单

  const { tags } = useSelector((state: RootState) => state.user)

  const {
    token: { borderRadiusLG }
  } = theme.useToken()

  const { menus } = useSelector((state: RootState) => state.user)

  /*
   * 递归获取菜单 Menu类型 数组
   */
  const getMenuItem = item => {
    return item.map(e => {
      const { icon, name, router, children, id } = e
      if (name === '首页' || !e) return
      const obj: any = {
        key: id,
        icon: <IconRenderer iconName={icon} />,
        label: name,
        router,
        children: children && children.length ? getMenuItem(children) : undefined
      }
      return obj
    })
  }

  // 禁止子菜单展开
  const onOpenChange = (keys: string[]) => {
    // 根据菜单宽度动态 - 收起子菜单
    sideWidth === menuMaxWidth ? setOpenKeys(keys) : setOpenKeys([])
  }

  const changeMenu = e => {
    if (!openKeys.length) {
      console.log('e', e)
    }
    let obj: any = menus.find(item => e.key == item.id)
    activeMenu.current = obj?.id
    // 增加历史纪录标签
    if (!historyList.current) historyList.current = [obj.id]
    else historyList.current.push(obj.id)
    const arr = getClickMenuTags(tags, obj)
    navigator(obj?.router)
    store.dispatch(setTags(arr))
  }

  useEffect(() => {
    const menuList = menus.filter(e => e.type != 2)
    const list = deepTree(menuList)
    console.log('menus', getMenuItem(list))
    setMenuList(getMenuItem(list))
    return () => {
      activeMenu.current = null
      historyList.current = null
    }
  }, [menus])

  useEffect(() => {
    // 去除重复 tag 历史纪录
    let arr = cloneDeep(historyList.current)
    arr = arr?.filter((e, i) => {
      if (!i) return true
      else if (e === arr[i - 1]) return false
      return true
    })
    historyList.current = arr
  }, [historyList.current])

  return (
    <Layout className={styles.main}>
      <Sider
        breakpoint='xs'
        collapsedWidth='0'
        className={styles.sider}
        width={sideWidth}
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}>
        <div className={styles.logo}>
          <img src='https://show.cool-admin.com/logo.png' alt='' />
          {sideWidth === menuMaxWidth && <div className={styles.text}>MY-ADMIN</div>}
        </div>
        <Menu
          className={styles.menu}
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['']}
          items={menuList}
          expandIcon={sideWidth === menuMaxWidth} // 隐藏下拉箭头
          onClick={changeMenu}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ userSelect: 'none' }}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <LayoutHeader
            sideWidth={sideWidth}
            setSideWidth={setSideWidth}
            activeMenu={activeMenu}
            historyList={historyList}
            menuList={menuList}
          />
        </Header>
        <Content className={styles.content}>
          <div
            style={{
              minHeight: 36,
              borderRadius: borderRadiusLG
            }}>
            <Outlet /> {/* 子路由渲染位置 */}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default React.memo(LayoutPage)
