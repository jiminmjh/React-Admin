// slb生成产品图片对比 - canvas
import React, { useEffect, useRef, useState } from 'react'

const CanvasPicture = ({ width = 800, height = 600, products = [], onExport }) => {
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const [fabric, setFabric] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(false) // 记录加载错误状态

  useEffect(() => {
    import('fabric').then((module) => {
      setFabric(module)
    })
  }, [])

  useEffect(() => {
    if (!fabric) return

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
      canvas.dispose()
      fabricRef.current = null
    }
  }, [fabric])

  useEffect(() => {
    if (!fabric || !fabricRef.current || products.length === 0) return

    const canvas = fabricRef.current
    canvas.clear()

    const loadImage = (url, left, top) => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn(`图片加载超时: ${url}`)
          resolve(null)  // 超时返回 null
        }, 3000)  // 超时时间：3秒

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
              resolve(null)  // 图片加载失败
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

      const results = await Promise.all(promises)

      // 检查是否有加载失败的图片
      if (results.includes(null)) {
        setLoadingError(true)
      }

      // 添加产品名称和信息
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
      setIsLoaded(true)
    }

    loadProducts().catch((error) => {
      console.error('加载图片出错:', error)
      setIsLoaded(true)
      setLoadingError(true)
    })
  }, [fabric, products])

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
      {loadingError && <div style={{ color: 'red', marginTop: 10 }}>图片加载失败，请稍后再试。</div>}
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
        disabled={!isLoaded}  // 图片未加载完成时禁用按钮
      >
        {isLoaded ? '导出图片' : '加载中...'}
      </button>
    </div>
  )
}

export default CanvasPicture
