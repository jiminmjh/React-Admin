import React from 'react'
import { Button, Spin } from 'antd'
import { useLoading } from './useLoading'

// 示例1: 不传参数，使用默认 key
const Example1 = () => {
  const { loading, wrap, isLoading } = useLoading()

  const handleSubmit = wrap('default', async () => {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('提交完成')
  })

  return (
    <div>
      <Button 
        type="primary" 
        loading={loading.default}
        onClick={handleSubmit}
      >
        提交表单
      </Button>
      
      {isLoading('default') && <Spin />}
    </div>
  )
}

// 示例2: 传入单个 key
const Example2 = () => {
  const { loading, wrap } = useLoading('submit')

  const handleSubmit = wrap('submit', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('提交完成')
  })

  return (
    <Button 
      type="primary" 
      loading={loading.submit}
      onClick={handleSubmit}
    >
      提交
    </Button>
  )
}

// 示例3: 传入多个 key
const Example3 = () => {
  const { loading, wrap, setLoading } = useLoading(['submit', 'delete', 'refresh'])

  const handleSubmit = wrap('submit', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('提交完成')
  })

  const handleDelete = wrap('delete', async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('删除完成')
  })

  const handleRefresh = wrap('refresh', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('刷新完成')
  })

  // 手动设置 loading 状态
  const handleManualLoading = () => {
    setLoading('submit', true)
    setTimeout(() => setLoading('submit', false), 2000)
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button 
        type="primary" 
        loading={loading.submit}
        onClick={handleSubmit}
      >
        提交
      </Button>
      
      <Button 
        danger
        loading={loading.delete}
        onClick={handleDelete}
      >
        删除
      </Button>
      
      <Button 
        loading={loading.refresh}
        onClick={handleRefresh}
      >
        刷新
      </Button>
      
      <Button onClick={handleManualLoading}>
        手动设置 Loading
      </Button>
    </div>
  )
}

// 示例4: 在组件中使用
const UserList = () => {
  const { loading, wrap } = useLoading(['fetch', 'delete', 'update'])

  const fetchUsers = wrap('fetch', async () => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    return [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]
  })

  const deleteUser = wrap('delete', async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`删除用户 ${id}`)
  })

  const updateUser = wrap('update', async (id: number, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`更新用户 ${id}`, data)
  })

  return (
    <div>
      <Button 
        loading={loading.fetch}
        onClick={fetchUsers}
      >
        获取用户列表
      </Button>
      
      <Button 
        danger
        loading={loading.delete}
        onClick={() => deleteUser(1)}
      >
        删除用户
      </Button>
      
      <Button 
        type="primary"
        loading={loading.update}
        onClick={() => updateUser(1, { name: '新名字' })}
      >
        更新用户
      </Button>
    </div>
  )
}

// 示例5: 在表单中使用
const LoginForm = () => {
  const { loading, wrap } = useLoading('login')

  const handleLogin = wrap('login', async (values: any) => {
    // 模拟登录 API
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('登录成功', values)
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin({ username: 'admin', password: '123456' })
    }}>
      <Button 
        type="primary" 
        htmlType="submit"
        loading={loading.login}
        block
      >
        登录
      </Button>
    </form>
  )
}

export { Example1, Example2, Example3, UserList, LoginForm } 