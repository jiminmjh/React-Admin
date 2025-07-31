export type ILoginRes = {
  expire: number;
  token: string;
  refreshExpire: number;
  refreshToken: string;
};

export type IUserInfo = {
  id: number;
  createTime: string;
  updateTime: string;
  departmentId: string;
  name: string;
  username: string;
  passwordV: number;
  nickName: string;
  headImg: string;
  phone: string;
  email: string;
  remark: string;
  status: number;
  socketId: null;
};

export type IMenuItem = {
  id: number;
  createTime: string;
  updateTime: string;
  parentId: string;
  name: string;
  router: string | null;
  perms: string | null;
  type: number;
  icon: string | null;
  orderNum: number;
  viewPath: string | null;
  keepAlive: number;
  isShow: number;
  children?: IMenuItem[];
};

export type IUserState = {
  token: string;
  refreshToken: string;
  info: IUserInfo | null;
  perms: string[];
  menus: IMenuItem[];
  tags: Partial<IRouteObj>[];
};

export type IRouteObj = {
  id: number;
  createTime: string;
  updateTime: string;
  parentId: number;
  name: string;
  router: string;
  perms: any;
  type: number;
  icon: string;
  orderNum: number;
  viewPath: string;
  keepAlive: boolean;
  isShow: boolean;
  active: boolean;
};

export type IUser = {
  person: IUserInfo;
  permmenu: { perms: string[]; menus: IMenuItem[] };
};
