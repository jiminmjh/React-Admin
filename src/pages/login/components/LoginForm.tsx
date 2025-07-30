import FormUi from '@/components/FormUi'
import { Input, FormInstance, message } from 'antd'
import request from '@/utils/request'
import { ICaptcha } from '@/types/login'
import { IFormLayout } from '@/types/component'
import { IRef } from '@/types/login'
import { store } from '@/stores'
import { fetchUserInfo, login } from '@/stores/user'
import { useNavigate } from 'react-router-dom'

const formLayout: Partial<IFormLayout> = {
  labelCol: { span: 24 }, // 标签占据8个网格
  wrapperCol: { span: 22 },
  layout: 'vertical'
}
const LoginForm = forwardRef<
  IRef,
  {
    form: FormInstance<{
      username: string
      password: string
    }>
  }
>(({ form }, ref) => {
  const [captchaId, setCaptchaId] = useState<string>('')
  const [html, setHtml] = useState('')
  const [isImg, setIsImg] = useState<boolean>(true)
  const { validateFields } = form
  const navigate = useNavigate() // 获取导航函数

  const refresh = async () => {
    const result: ICaptcha = await request.get<{ captchaId: string; data: string }>('/admin/base/open/captcha', {
      width: 150,
      height: 44,
      color: '#2c3142'
    })
    setHtml(result.data)
    setCaptchaId(result.captchaId)
  }

  const submit = async () => {
    try {
      const values = await validateFields()
      const res: any = await store.dispatch(login({ ...values, captchaId: captchaId }))
      if (!res.payload) return
      message.success('登录成功')
      // 登陆成功获取用户信息
      await store.dispatch(fetchUserInfo())
      navigate('/')
    } catch (e: any) {
      message.error(e?.errorFields?.[0].errors[0])
    } finally {
      await refresh()
    }
  }

  useImperativeHandle(ref, () => ({ submit }))

  const formList = [
    {
      type: 'input',
      label: '用户名',
      name: 'username',
      placeholder: '请输入用户名'
    },
    {
      type: 'input',
      label: '密码',
      name: 'password',
      placeholder: '请输入密码'
    },
    {
      type: 'slot',
      label: '验证码',
      name: 'verifyCode',
      placeholder: '请输入验证码',
      render: (
        <div
          className='captcha-div'
          onKeyUp={e => {
            if (e.key === 'Enter') submit()
          }}>
          <div className='captcha-input'>
            <Input placeholder='请输入验证码' />
          </div>
          {isImg ? (
            <img
              src={html}
              alt='验证码'
              style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
              onError={e => setIsImg(false)}
            />
          ) : (
            <div className='captcha' onClick={refresh} dangerouslySetInnerHTML={{ __html: html }}></div>
          )}
        </div>
      )
    }
  ].map(e => ({
    ...e,
    required: false,
    validatestatus: '',
    help: '' /* 自定义提示 */,
    rules: [{ required: true, message: e.placeholder }]
  }))

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className='login-form'>
      <FormUi form={form} formList={formList} formLayout={formLayout} colLayout={{ md: 24, lg: 24 }} />
    </div>
  )
})
export default LoginForm
