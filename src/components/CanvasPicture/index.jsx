import React, { useEffect, useRef, useState } from 'react'

const CanvasPicture = ({ width = 800, height = 600, products = [], onExport }) => {
  const canvasRef = useRef(null)          // 原生 canvas 引用
  const fabricRef = useRef(null)          // fabric.Canvas 引用
  const [fabric, setFabric] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // ✅ 动态加载 fabric.js
  useEffect(() => {
    import('fabric').then((module) => {
      console.log('module', module, module.default)
      setFabric(module)
    })
  }, [])

  // ✅ 初始化 canvas
  useEffect(() => {
    console.log('fabric', fabric)
    if (!fabric) return

    // 清理旧 canvas，防止重复创建
    if (fabricRef.current) {
      fabricRef.current.dispose()
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#fff'
    })

    fabricRef.current = canvas

    return () => {
      canvas.dispose()  // 销毁 canvas，防止内存泄漏
      fabricRef.current = null
    }
  }, [fabric])

  // ✅ 加载图片并确保加载完成
  useEffect(() => {
    if (!fabric || !fabricRef.current || products.length === 0) return

    const canvas = fabricRef.current
    canvas.clear()

    const loadImage = (url, left, top) => {
      return new Promise((resolve) => {
        // ✅ 添加超时机制，防止图片加载卡住
        const timeout = setTimeout(() => {
          console.warn(`图片加载超时: ${url}`)
          resolve(null)  // 超时返回 null，防止挂起
        }, 3000)  // 3 秒超时

        fabric.Image.fromURL(
          url,
          (img) => {
            clearTimeout(timeout)  // 清理超时
            img.set({
              left,
              top,
              scaleX: 0.5,
              scaleY: 0.5
            })
            canvas.add(img)
            resolve(img)
          },
          {
            crossOrigin: 'anonymous',
            onError: () => {
              console.error(`图片加载失败: ${url}`)
              clearTimeout(timeout)
              resolve(null)  // 图片加载失败也 resolve，防止挂起
            }
          }
        )
      })
    }

    const loadProducts = async () => {
      const promises = products.map((product, index) =>
        Promise.race([
          loadImage(product.image, 50 + index * 250, 100),
          new Promise((resolve) => setTimeout(() => resolve(null), 3000)) // 超时跳过
        ])
      )

      await Promise.all(promises)

      // ✅ 产品名称和信息
      products.forEach((product, index) => {
        const name = new fabric.Text(product.name, {
          left: 50 + index * 250,
          top: 30,
          fontSize: 20,
          fill: '#333'
        })

        const info = new fabric.Text(product.info, {
          left: 50 + index * 250,
          top: 60,
          fontSize: 16,
          fill: '#666'
        })

        canvas.add(name, info)
      })

      canvas.renderAll()
      setIsLoaded(true)  // 标记加载完成
    }

    loadProducts().catch((error) => {
      console.error('加载图片出错:', error)
      setIsLoaded(true)
    })
  }, [fabric, products])

  // ✅ 导出图片
  const exportImage = () => {
    if (!fabricRef.current || !isLoaded) {
      console.error('🚫 Canvas is not ready yet!')
      return
    }

    const canvas = fabricRef.current
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    })

    if (onExport) {
      onExport(dataURL)
    }
  }

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} />
      <button
        onClick={exportImage}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
        disabled={!isLoaded}  // ✅ 图片未加载完成时禁用按钮
      >
        {isLoaded ? '导出图片' : '加载中...'}
      </button>
    </div>
  )
}

export default CanvasPicture
