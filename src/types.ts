import {
  CHAT_MESSAGE_VARIANT,
  CHAT_ROOM_STATUS,
  PAYMENT_STATUS,
  WARE_VARIANT,
  WARE_STATUS,
} from './utils/consts';

export interface GenericFormProps<T> {
  backendError?: string;
  isLoading?: boolean;
  disableFormOnSubmit?: boolean;
  form?: T;
  initialValues?: T;
  onChange?: (values: T) => void;
  onSubmit: (values: T) => Promise<void>;
}

export interface ProductSubscribtion {
  duration: string;
  until: Date;
  price: number;
}

export interface UserSettings {
  blurPhotos: boolean;
}

export type ImageItem = {
  uri: string | null;
  isLoading?: boolean;
};

export type gender = 'm' | 'f';

export interface ProfileFormData {
  name?: string;
  photos?: ImageItem[];
  gender?: gender;
  age?: string;
  nation?: string;
  citizenship?: string;
  city?: string;
  country?: string;
  can_move?: boolean;
  education?: string;
  earn?: string;
  marrige?: string;
  children?: string;
  disability?: string;
  religion?: string;
  polygamy?: string;
  hidgab?: string;
  wives?: string;
  appearance?: string;
  dont_show_photos?: boolean;
  show_online?: boolean;
  about?: string;
  userId?: string;
  friends?: boolean;
  is_agent?: boolean;
}

export interface User extends ProfileFormData {
  profileId: string;
  isOnline?: boolean;
  last_seen?: Date;
  status?: string;
  avatar?: string;
  isLeveraged?: boolean;
  imagePlaceholder?: string;
}

export interface ChatListMessage {
  id: string;
  picture: string;
  name: string;
  lastMessage: string;
  date: Date;
  isUnread: boolean;
}

export enum ChatMessageFeedbackStatus {
  Error = 'error',
  Loading = 'loading',
  Success = 'success',
}

export interface ChatMessage {
  id: string;
  self?: boolean;
  created_at?: Date;
  status?: ChatMessageFeedbackStatus;
  text?: string;
  variant: CHAT_MESSAGE_VARIANT;
  author_user_id: string;
  likeDirection?: 'in' | 'out';
}

export type feedFiewType = 'grid' | 'feed';

export interface ChatRoom {
  id?: string;
  chatRoomId?: string;
  targetUserId?: string;
  status?: CHAT_ROOM_STATUS;
  name?: string;
  lastMessage?: string;
  isUnread?: boolean;
  isOnline?: boolean;
  picture?: string;
  lastMessageDate?: Date;
  created_at?: Date;
  profile?: User;
}

export type ClaimVariant = 'scam' | 'abuse' | 'threat' | 'etc';

export interface Ware {
  id: string;
  status: WARE_STATUS | string;
  variant: WARE_VARIANT | string;
  expires_at?: Date;
  created_at?: Date;
  activated_at?: Date;
  duration?: number;
  paymentId?: string;
  payment?: Payment;
}

export interface WareDictItem {
  id: string;
  duration?: number;
  variant: WARE_VARIANT;
  amount: number;
  cur: string;
}

export interface Payment {
  id?: string;
  amount?: number;
  status?: PAYMENT_STATUS | string;
  created_at?: Date;
  confirmed_at?: Date;
  paymentId?: string;
  cur?: string;
  error?: string;
  sbp_href?: string;
  card_payment_href?: string;
  variant?: string;
  expires_at?: Date;
  finalized_at?: Date;
}
