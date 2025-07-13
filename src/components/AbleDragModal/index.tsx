import React, { useEffect, useState, useRef } from 'react'
import { Button, Modal } from 'antd'
import './index.less'

type getContainerFunc = () => HTMLElement

interface ModalProps {
  visible: boolean
  title: React.ReactNode
  children: React.ReactNode
  destroyOnClose: boolean
  getContainer: string | false | HTMLElement | getContainerFunc
  width: number | string
  style: React.CSSProperties
  bodyStyle: React.CSSProperties
  onClose: () => void
  onSubmit: () => void
  onReset: () => void
  maskClosable: boolean
  showConfirm: string
  closeBtnName: string
  showClose: boolean
  childBtnDis: boolean
  isNoDelay: boolean
  afterModalOpen: () => {} | null
  afterClose: () => void
  forceRender: boolean
  showConfirmStyle: React.CSSProperties
  loadingBtnDis: boolean
  wrapClassName: string
  footer: React.ReactNode
}

/**
 * 针对antd4封装功能：
 * 1. header 模态框可拖动功能。
 * 2. 内容区样式设置增强 - bodyStyle。
 * 3. 灵活的底部按钮配置
 * 4. 关闭后的额外操作 afterClose
 *
 *
 *
- Ant Design 5已内置智能位置计算
- 自动处理窗口边界和多个模态框叠加
- 支持响应式布局调整

- 可移除的代码 ：
- 手动计算模态框位置的逻辑（如 offsetWidth/Height 计算）
- 强制设置 left/top 样式的代码
- 多模态框叠加时的特殊处理
- 保留的必要功能 ：

- 拖动功能的位置计算
- 特殊布局需求的自定义位置


 /**
 * 基础使用：
 * <AbleDragModal
 *   title="投后名单新增"
 *   visible={true}
 *   width={700}
 *   bodyStyle={{ height: '400px' }}
 *   onClose={() => {}}
 *   showConfirm="确认"
 *   onSubmit={() => {}}
 *   showClose
 * >
 *      弹窗内容
 * </AbleDragModal>
 **/

/**
 * props：
 * 1. visible：控制模态框显隐，true显示，false隐藏。
 * 2. title：模态框标题，可多种类型。
 * 3. children：模态框内容区，放组件等。
 * 4. destroyOnClose：关闭时是否销毁，true销毁，false隐藏。
 * 5. getContainer：指定挂载容器，可字符串、false、HTMLElement或函数。
 * 6. width：设置模态框宽度，像素值或字符串。
 * 7. style：模态框内联样式。
 * 8. bodyStyle：内容区样式，如最大高度等。
 * 9. onClose：关闭模态框回调函数。
 * 10. onSubmit：提交操作回调函数。
 * 11. onReset：重置操作回调函数。
 * 12. maskClosable：控制遮罩点击是否关闭模态框，true可关，false不可关。
 * 13. showConfirm：确认按钮显示文本。
 * 14. closeBtnName：关闭按钮显示文本。
 * 15. showClose：是否显示关闭按钮，true显示，false不显示。
 * 16. childBtnDis：子按钮是否禁用。
 * 17. isNoDelay：是否无延迟，与操作延迟效果有关。
 * 18. afterModalOpen：模态框打开后回调函数。
 * 19. afterClose：模态框关闭后回调函数。
 * 20. forceRender：是否强制渲染。
 * 21. showConfirmStyle：确认按钮样式。
 * 22. loadingBtnDis：加载按钮是否禁用。
 * 23. wrapClassName：模态框外层包装元素类名。
 * 24. footer：模态框底部内容，可自定义元素，未提供时根据其他状态动态生成底部按钮。
 **/

const AbleDragModal: React.FC<Partial<ModalProps>> = ({
  visible,
  title,
  children,
  destroyOnClose = true,
  getContainer,
  width = 1050,
  style,
  bodyStyle = { maxHeight: '630px' },
  onClose,
  onSubmit,
  onReset,
  maskClosable = false,
  showConfirm,
  closeBtnName,
  showClose,
  childBtnDis = false,
  isNoDelay = false,
  afterModalOpen = null,
  forceRender = false,
  showConfirmStyle,
  loadingBtnDis = false,
  wrapClassName = '',
  afterClose = () => null,
  footer
}) => {
  const modalItem = useRef<HTMLElement | null>(null)
  const modalModal = useRef<HTMLElement | null>(null)
  const [isPress, setIsPress] = useState(false)
  const [distance, setDistance] = useState({
    xDistance: 0,
    yDistance: 0
  })
  const [btnDisabled, setBtnDisabled] = useState(false)

  useEffect(() => {
    if (visible) {
      afterModalOpen && afterModalOpen()
      setTimeout(() => {
        if (!style) {
          let len = document.querySelectorAll('.ant-modal')?.length
          const modal = document.querySelectorAll('.ant-modal')
          len > 0 &&
            Array.from(modal).forEach(m => {
              if (m?.className.includes('ant-modal-confirm') || m?.className.includes('ant-modal-ignore')) return
              const { offsetWidth, offsetHeight } = m as HTMLElement
              ;(m as HTMLElement).style.left =
                offsetWidth > ((m as HTMLElement)?.parentNode as HTMLElement)?.offsetWidth
                  ? '0'
                  : 'calc(50% - ' + offsetWidth / 2 + 'px)'
              ;(m as HTMLElement).style.top =
                offsetHeight > ((m as HTMLElement)?.parentNode as HTMLElement)?.offsetHeight
                  ? '0'
                  : 'calc(50% - ' + offsetHeight / 2 + 'px)'
            })
        }
      }, 10)
    }
  }, [
    document.querySelectorAll('.ant-modal')?.length,
    visible,
    document.documentElement.offsetWidth,
    document.documentElement.offsetHeight
  ])

  useEffect(() => {
    const content = document.getElementsByClassName('ant-modal-body')
    Array.from(content).forEach(el => {
      Object.assign((el as HTMLElement).style, bodyStyle)
    })
  }, [])

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        let wrapLen: number = document.querySelectorAll('.ant-modal-wrap')?.length
        let wrapModal = document.querySelectorAll('.ant-modal-wrap')
        // console.log('wrapModal', wrapModal, Array.from(wrapModal))
        if (wrapLen) {
          Array.from(wrapModal).forEach(each => {
            if ((each as HTMLElement)?.style.display != 'none') {
              //有且只有一个
              modalItem.current = (each as HTMLElement)?.getElementsByClassName('ant-modal-header')[0] as HTMLElement
              modalModal.current = each as HTMLElement
            }
          })
        }
        if (modalItem.current) {
          ;(modalItem.current as HTMLElement).style.cursor = 'move'
          ;(modalItem.current as HTMLElement)?.addEventListener('mousedown', onMousedown)
        }
      }, 100)
    } else {
      onClose?.()
    }
  }, [visible])

  useEffect(() => {
    if (modalItem.current && distance && isPress) {
      document.body.addEventListener('mousemove', onmMuseover)
      document.body.addEventListener('mouseup', onmMuseup)
    }
    return () => {
      if (!modalItem.current) return
      document.body.removeEventListener('mousemove', onmMuseover)
      document.body.removeEventListener('mouseup', onmMuseup)
    }
  }, [modalItem.current, distance, isPress])

  const onMousedown = e => {
    const currentModal = (modalModal.current as HTMLElement)?.getElementsByClassName('ant-modal')[0]
    const { left, top } = currentModal?.getBoundingClientRect()
    setIsPress(true)
    setDistance({
      xDistance: e.pageX - left,
      yDistance: e.pageY - top
    })
    document.onselectstart = () => false
  }

  const onmMuseover = e => {
    if (!isPress) return
    if (wrapClassName) {
      const modalWrap = document.getElementsByName(wrapClassName)[0]
      if (modalWrap) {
        ;(modalWrap.querySelector('.ant-modal') as HTMLElement).style.left = `${e.pageX - distance.xDistance}px`
        ;(modalWrap.querySelector('.ant-modal') as HTMLElement).style.top = `${e.pageY - distance.yDistance}px`
      }
    } else {
      ;((modalModal.current as HTMLElement).getElementsByClassName('ant-modal')[0] as HTMLElement).style.left = `${
        e.pageX - distance.xDistance
      }px`
      ;((modalModal.current as HTMLElement).getElementsByClassName('ant-modal')[0] as HTMLElement).style.top = `${
        e.pageY - distance.yDistance
      }px`
    }
  }

  const onmMuseup = () => {
    document.onselectstart = () => true
    setIsPress(false)
    setDistance({
      yDistance: 0,
      xDistance: 0
    })
  }

  const close = () => {
    onmMuseup()
    onClose && onClose()
    const currentModal = (modalModal.current as HTMLElement).getElementsByClassName('ant-modal')[0]
    const antModaWwrap = modalItem.current as HTMLElement
    // currentModal.style.left = '35%';
    // currentModal.style.top = '35%';
    // antModaWwrap.style.display = 'none'
    // currentModal.style.display = 'none'
  }

  function clickCallback(
    onSaveSetting: { (): void } | null = null,
    onSubmit: { (): void } | null = null,
    onCalculate: { (): void } | null = null,
    onAddRow: { (): void } | null = null,
    close: { (): void } | null = null,
    onReset: { (): void } | null = null
  ) {
    setBtnDisabled(true)
    onSubmit?.()
    onSaveSetting?.()
    onCalculate?.()
    onAddRow?.()
    close?.()
    onReset?.()
    setTimeout(() => setBtnDisabled(false), 2000)
  }

  return (
    <Modal
      afterClose={() => afterClose?.()}
      open={visible}
      getContainer={getContainer}
      title={title}
      style={{ position: 'absolute', ...style }}
      forceRender={forceRender}
      footer={
        footer
          ? footer
          : [
              onSubmit ? (
                <Button
                  key='query'
                  style={showConfirmStyle}
                  type='primary'
                  disabled={isNoDelay ? false : btnDisabled || childBtnDis || loadingBtnDis}
                  onClick={() => clickCallback(onSubmit)}>
                  {showConfirm || '保存'}
                </Button>
              ) : null,
              onReset ? (
                <Button
                  key='reset'
                  type='primary'
                  disabled={btnDisabled || loadingBtnDis}
                  onClick={() => clickCallback(onReset)}>
                  {'重置'}
                </Button>
              ) : null,
              showClose ? (
                <Button
                  key='cancle'
                  type='primary'
                  disabled={btnDisabled || loadingBtnDis}
                  onClick={() => clickCallback(close)}>
                  {closeBtnName || '取消'}
                </Button>
              ) : null
            ]
      }
      onCancel={close}
      width={width}
      destroyOnClose={destroyOnClose}
      wrapClassName={wrapClassName}
      maskClosable={maskClosable}>
      {visible && <div className='ableDragModal'>{children}</div>}
    </Modal>
  )
}

export default AbleDragModal
