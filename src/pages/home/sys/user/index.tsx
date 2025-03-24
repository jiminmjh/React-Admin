import React from 'react'
import { Button } from 'antd'

import request from '@/utils/request.ts'
import { store } from '@/stores'
import { fetchUserInfo } from '@/stores/user.ts'

function User() {

  const refresh = async () => await store.dispatch(fetchUserInfo())
  return (
    <div>user
      <Button type="primary" onClick={refresh}></Button>
    </div>
  )
}

export default User
