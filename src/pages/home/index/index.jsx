// // 虚拟列表VTable
// import { VariableSizeList as List } from 'react-window'
//
// const columns = [
//   { title: 'ID', dataIndex: 'id', width: 100 },
//   { title: 'Name', dataIndex: 'name', width: 200 },
//   { title: 'Age', dataIndex: 'age', width: 200 }
// ]
//
// const data = new Array(10000).fill(null).map((_, i) => ({
//   key: i,
//   id: i,
//   name: `Name ${i}`,
//   age: `age ${i}`
// }))
//
// const Row = ({ index, style }) => (
//   <div style={{ ...style, display: 'flex' }}>
//     {columns.map(col => (
//       <div key={col.dataIndex} style={{ width: col.width, padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
//         {data[index][col.dataIndex]}
//       </div>
//     ))}
//   </div>
// )
//
// const VirtualTable = () => {
//   const listRef = useRef(null)
//   const rowHeight = () => 50 // 每行高度
//   console.log('navigator.userAgent', navigator.userAgent)
//   return (
//     <div style={{ width: '100%', border: '1px solid #ddd' }}>
//       <div style={{ display: 'flex', background: '#fafafa', fontWeight: 'bold' }}>
//         {columns.map(col => (
//           <div key={col.dataIndex} style={{ width: col.width, padding: '8px' }}>
//             {col.title}
//           </div>
//         ))}
//       </div>
//       <List ref={listRef} height={400} itemCount={data.length} itemSize={rowHeight} width='100%'>
//         {Row}
//       </List>
//     </div>
//   )
// }
//
// export default VirtualTable

// canvas 生成产品对比图片
import React, { useState, useEffect } from 'react'
import { Button, message, Card, Space, Input } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
// import CanvasPicture from '@/components/CanvasPicture'
import PageLayout from '@/components/PageLayout'
import request from '@/utils/request'

const ProductCompare = () => {
  // 验证码相关状态
  const [captchaData, setCaptchaData] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaInput, setCaptchaInput] = useState('')

  // 刷新验证码接口
  const refreshCaptcha = async () => {
    try {
      setLoading(true)
      const result = await request.get('/admin/base/open/captcha', {
        width: 150,
        height: 44,
        color: '#2c3142'
      })

      setCaptchaData(result.data)
      setCaptchaId(result.captchaId)
      console.log('验证码ID:', result.captchaId)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 验证验证码
  const validateCaptcha = async () => {
    if (!captchaInput.trim()) {
      message.warning('请输入验证码')
      return
    }

    try {
      // 这里可以调用验证接口，根据实际接口调整
      console.log('验证码ID:', captchaId)
      console.log('输入的验证码:', captchaInput)
      message.success('验证码验证成功')
      setCaptchaInput('') // 清空输入
    } catch (error) {
      message.error('验证码验证失败')
      console.error('验证失败:', error)
    }
  }

  // const products = [
  //   {
  //     name: '产品 A',
  //     image: 'https://via.placeholder.com/200x200.png?text=Product+A',
  //     info: '价格: ¥1999\n销量: 5000件'
  //   },
  //   {
  //     name: '产品 B',
  //     image: 'https://via.placeholder.com/200x200.png?text=Product+B',
  //     info: '价格: ¥2999\n销量: 8000件'
  //   }
  // ]
  //
  // const handleExport = (image) => {
  //   console.log('导出图片 Base64:', image)
  // }

  return (
    <PageLayout>
      <div>
        <h1>产品对比图生成</h1>

        {/* 验证码功能区域 */}
        <Card title="验证码测试" style={{ marginBottom: 20, maxWidth: 500 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* 验证码显示和刷新按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 150,
                  height: 44,
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={refreshCaptcha}
                title="点击刷新验证码"
              >
                {captchaData ? (
                  <div dangerouslySetInnerHTML={{ __html: captchaData }} />
                ) : (
                  <span style={{ color: '#999', fontSize: '12px' }}>点击获取验证码</span>
                )}
              </div>

              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={loading}
                onClick={refreshCaptcha}
              >
                刷新验证码
              </Button>
            </div>

            {/* 验证码输入和验证 */}
            <Space>
              <Input
                placeholder="请输入验证码"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                style={{ width: 150 }}
                onPressEnter={validateCaptcha}
                maxLength={6}
              />
              <Button type="primary" onClick={validateCaptcha}>
                验证
              </Button>
            </Space>

            {/* 提示信息 */}
            <div style={{ fontSize: '12px', color: '#666' }}>
              <p>验证码ID: {captchaId || '暂无'}</p>
              <p>提示: 点击验证码图片或刷新按钮可以重新获取验证码</p>
            </div>
          </Space>
        </Card>

        {/*<CanvasPicture products={products} onExport={handleExport} />*/}
      </div>
    </PageLayout>
  )
}

export default ProductCompare
