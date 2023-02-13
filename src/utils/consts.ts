export enum CHAT_MESSAGE_VARIANT {
  like = 'like',
  message = 'message',
}

export enum CHAT_ROOM_STATUS {
  request = 'request',
  open = 'open',
  closed = 'closed',
  'closed-hidden' = 'closed-hidden',
  'closed-claimed' = 'closed-claimed',
}

export enum WARE_VARIANT {
  'access-3-day' = 'access-3-day',
  'access-7-day' = 'access-7-day',
  'access-30-day' = 'access-30-day',
  'access-120-day' = 'access-120-day',
  'premium-30-day' = 'premium-30-day',
  'top-1-day' = 'top-1-day',
}

export enum WARE_STATUS {
  created = 'created',
  payed = 'payed',
  activated = 'activated',
  expired = 'expired',
  disabled = 'disabled',
}

export enum PAYMENT_STATUS {
  created = 'created',
  pending = 'pending',
  expired = 'expired',
  error = 'error',
  ok = 'ok',
}

export enum USER_STATUS {
  created = 'created',
  confirmed = 'confirmed',
  profileFilled = 'profileFilled',
  payed = 'payed',
  moderation = 'moderation',
  disabled = 'disabled',
}

export enum NEXT_PAGE {
  profile = 'profile',
  'user-disabled' = 'user-disabled',
  'user-moderation' = 'user-moderation',
}
