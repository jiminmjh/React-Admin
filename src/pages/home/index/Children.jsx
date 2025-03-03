import React from 'react'
import FormUi from '@/components/FormUi'
import { Checkbox } from 'antd'

const formLayout = {
  labelCol: { span: 10 }, // 标签占据8个网格
  wrapperCol: { span: 12 },
  layout: 'vertical'
}

function Children(props) {
  const { zhList, form, setZhList } = props
  const [dis, setDis] = useState(false)
  const listRef = useRef(null)
  const flag = useRef(true)

  const list = [
    { data: 'zs', label: '张三' },
    { data: 'ls', label: '里斯' },
    { data: 'ww', label: '王五' }
  ]

  //!!!todo import 进行动态渲染 list值
  const renderDict = () => {
    const { glr } = form.getFieldsValue()
    const r1 = zhList.map(item => ({ data: item.zhdm, label: item.zhAdd }))
    const r2 = listRef.current?.map(item => ({ data: item.zhdm, label: item.zhAdd }))
    if (!glr || glr?.length) return r1
    return r2
  }

  const formList = [
    {
      type: 'select',
      label: '组合',
      name: 'ZHDM',
      mode: 'multiple',
      dropdownRender: (menu) => {
        return (
          <>
            {menu}
            <div>
              <Checkbox onChange={
                (e) => {
                  form.setFieldsValue({ ZHDM: e.target.checked ? zhList.map(e => e.zhdm) : [] })
                  setDis(e.target.checked)
                }
              }>全选</Checkbox>
            </div>
          </>
        )
      },
      dict: renderDict()
    },

    {
      type: 'select',
      label: 'glr',
      name: 'glr',
      mode: 'multiple',
      allowClear: true,
      onChange: (e) => {
        if (!e || !e?.length) setZhList([])
        else setZhList([{ zhAdd: '11', zhdm: 'aa', id: 1 }])
        // renderDict()
      },
      disabled: dis,
      dict: list
    }

  ]

  useEffect(() => {
    //!!!todo import 开关控制保存初始化变量
    if (!flag.current) return
    if (zhList?.length) {
      flag.current = false
      listRef.current = zhList
    }
  }, [zhList])

  // useEffect(() => {
  //   console.log('listRef.current', listRef.current)
  // }, [listRef.current])

  return (
    <div style={{ height: '100%' }}>
      Children
      <FormUi form={form} formList={formList} formLayout={formLayout} colLayout={{ md: 8, lg: 8 }} />
    </div>
  )
}

export default Children
