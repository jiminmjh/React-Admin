// store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import storage from '@/utils/storage'
import { getPermmenu, getPerson, loginAPI } from '@/server'
import { ILoginRes, IMenuItem, IRouteObj, IUserInfo, IUserState } from '@/types/user'
import { ILoginParams } from '@/types/login'
import { persistReducer } from 'redux-persist'
import storageEngine from 'redux-persist/lib/storage' // 使用 localStorage 作为存储引擎

type ISetToken = ILoginRes & { isChangeRefresh: boolean }
type IUser = [person: IUserInfo, permmenu: { perms: string[]; menus: IMenuItem[] }]

// 配置 redux-persist 的持久化设置
const persistConfig = {
  key: 'user',                // 持久化存储的 key
  storage: storageEngine,     // 使用 localStorage 进行存储
  whitelist: ['info', 'perms', 'menus', 'tags'] // 需要持久化的字段
}

const initialState: IUserState = {
  token: storage.get('token') || '',
  refreshToken: storage.get('refreshToken') || '',
  info: null,
  perms: [],
  menus: [],
  tags: []
}

/** createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>
 •	Returned：异步操作成功时返回的数据类型。
 •	ThunkArg：调用 thunk 时传入的参数类型（通常是 payload 的类型）。
 •	ThunkApiConfig：可选，thunkAPI 的配置类型，默认是 {}。
 **/
// 异步登录操作
export const login = createAsyncThunk<ILoginRes, ILoginParams>('user/login', async (params, { dispatch }) => {
  const result = await loginAPI(params)
  dispatch(setToken({ ...result, isChangeRefresh: true }))
  return result
})

// 异步获取用户信息
export const fetchUserInfo = createAsyncThunk<IUser>('user/get', async () => {
  const [person, permmenu] = await Promise.all([getPerson(), getPermmenu()])
  return { person, permmenu }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<ISetToken>) => {
      const { token, refreshToken, expire, refreshExpire } = action.payload
      // 写入token
      state.token = token
      const isRefresh = action.payload.isChangeRefresh ?? true
      isRefresh && (state.refreshToken = refreshToken)

      // 写入本地存储
      // storage.set('token', token, 5) // 自定义token到期时间 s
      storage.set('refreshToken', refreshToken, 5)
      storage.set('token', token, expire)
      // storage.set('refreshToken', refreshToken, refreshExpire)
    },
    logout: state => {
      state.token = ''
      state.refreshToken = ''
      state.info = null
      state.perms = []
      state.menus = []
      state.tags = []
      storage.remove('token')
      storage.remove('refreshToken')
    },
    setTags: (state, action: PayloadAction<Partial<IRouteObj>[]>) => {
      state.tags = action.payload
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchUserInfo.fulfilled, (state: IUserState, { payload }) => {
      state.info = payload.person
      state.perms = payload.permmenu.perms
      state.menus = payload.permmenu.menus
    })
  }
})

export const { setToken, logout, setTags } = userSlice.actions
// 使用 persistReducer 包装 userSlice.reducer
export default persistReducer(persistConfig, userSlice.reducer)
