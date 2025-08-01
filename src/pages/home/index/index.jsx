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
import React from 'react'
import CanvasPicture from '@/components/CanvasPicture'
import PageLayout from '@/components/PageLayout'

const ProductCompare = () => {
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
        {/*<CanvasPicture products={products} onExport={handleExport} />*/}
      </div>
    </PageLayout>
  )
}

export default ProductCompare
