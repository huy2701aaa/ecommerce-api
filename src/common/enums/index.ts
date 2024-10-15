export enum COMMON_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ROLE {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum ORDER_STATUS {
  PENDING = 'pending',
  DELIVERY = 'delivery',
  SUCCESS = 'success',
  CANCEL = 'cancel',
}

export enum PAYMENT_TYPE {
  NORMAL = 'normal',
  ONLINE = 'paypal',
}
