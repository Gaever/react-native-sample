import moment from 'moment';
import {Ware} from './types';

export const users = [
  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '1',
    isOnline: true,
    name: 'Муслима',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
      {
        key: '1',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
      {
        key: '2',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
      },
    ],
  },
  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '2',
    isOnline: false,
    name: 'Муслима Абдурахмановна',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        // uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
        uri: null,
      },
      {
        key: '1',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
      {
        key: '2',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
    ],
  },
  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '3',
    isOnline: true,
    name: 'Муслима',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
      {
        key: '1',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
      },
      {
        key: '2',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
    ],
  },

  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '4',
    isOnline: true,
    name: 'Муслима',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
      {
        key: '1',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
      {
        key: '2',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
      },
    ],
  },
  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '5',
    isOnline: false,
    name: 'Муслима',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
      },
      {
        key: '1',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
      {
        key: '2',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
    ],
  },
  {
    about:
      'АССАЛАМУ АЛЕЙКУМ ИЩУ РЕЛИГИОЗНОГО МУЖЧИНА СЕРБЕЗНОГО МНЕ 29. Разводе .Покрытая в никабе есть двое детей живу в Махачкале .мужчина желательно в религии строгий от 28-35 лет .Второй третий не предлагать',
    age: '28',
    profileId: '6',
    isOnline: true,
    name: 'Муслима',
    city: 'Махачкала',
    country: 'Россия',
    userSettings: {
      blurPhotos: false,
    },
    photos: [
      {
        key: '0',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
      },
      {
        key: '1',
        uri: 'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg',
      },
      {
        key: '2',
        uri: 'https://images.theconversation.com/files/253736/original/file-20190114-43520-18gk8r7.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop',
      },
    ],
  },
];

export const usersTheyLikeMe = [users[0], users[1]];

export const usersILikeThem = [users[1], users[2]];

export const topUsers = [...users, ...users, ...users].map((item, index) => ({
  ...item,
  profileId: `${index}`,
}));

export const currentUser = {
  ...users[0],
  userSettings: {
    blurPhotos: false,
  },
};

export const wares: Ware[] = [
  {
    id: '1',
    created_at: new Date(),
    expires_at: moment().add(5, 'days').toDate(),
    variant: 'top-1-day',
    status: 'payed',
  },
  {
    id: '2',
    created_at: new Date(),
    expires_at: moment().add(5, 'days').toDate(),
    variant: 'access-3-day',
    status: 'activated',
  },
  {
    id: '3',
    created_at: moment().subtract(6, 'days').toDate(),
    activated_at: moment().subtract(4, 'days').toDate(),
    expires_at: moment().subtract(1, 'days').toDate(),
    variant: 'top-1-day',
    status: 'expired',
    payment: {
      id: '1',
      amount: 1000,
      created_at: new Date(),
      confirmed_at: new Date(),
      cur: 'RUB',
      status: 'ok',
    },
  },
  {
    id: '4',
    created_at: moment().subtract(7, 'days').toDate(),
    expires_at: moment().subtract(12, 'days').toDate(),
    variant: 'premium-30-day',
    status: 'activated',
  },
  {
    id: '5',
    created_at: moment().subtract(7, 'days').toDate(),
    expires_at: moment().subtract(12, 'days').toDate(),
    variant: 'access-120-day',
    status: 'created',
    payment: {
      id: '2',
      created_at: new Date(),
      amount: 1000,
      cur: 'RUB',
      status: 'error',
      error: 'ERR_BALANCE',
    },
  },
];
