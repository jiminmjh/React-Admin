import { Form, Button } from 'antd'
import LoginForm from './components/LoginForm'
import logo from '/public/assets/logo.png'
import { IRef } from '@/types/login'
import './login.less'

function Login() {
  const [form] = Form.useForm()
  const formRef = useRef<IRef | null>(null)

  return (
    <div className='main'>
      <div className='left-login'></div>
      <div className='right-login'>
        <div className='right-form'>
          <img src={logo as string} alt='' />
          <LoginForm form={form} ref={formRef} />
          <Button className='submit' type='primary' onClick={() => formRef.current?.submit()}>
            登陆
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
