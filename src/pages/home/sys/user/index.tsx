import React from 'react'
import { Button } from 'antd'

import request from '@/utils/request.ts'
import { store } from '@/stores'
import { fetchUserInfo } from '@/stores/user.ts'
import PageLayout from '@/components/PageLayout'

function User() {
  const refresh = async () => await store.dispatch(fetchUserInfo())
  return (
    <PageLayout>
      <div>
        user
        <Button type='primary' onClick={refresh}></Button>
      </div>
    </PageLayout>
  )
}

export default User
