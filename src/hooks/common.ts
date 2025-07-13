// 弹框之类的变量布尔值
export const useVisible = () => {
  const [visible, setVisible] = useState(false)
  const onChange = () => setVisible(!visible)

  return {
    visible,
    onChange
  }
}
