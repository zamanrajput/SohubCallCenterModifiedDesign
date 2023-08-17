import React from 'react';
import { History } from '@mui/icons-material';
import {
  IconMessage2,
  IconPackage,
  IconAperture,
  IconCalendar,
  IconNotes,
  IconMail,
  IconUserCircle,
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

export interface MenuItemPropsTypeCustom {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  chip?: string;
  chipColor?: string;
}

const Menuitems: MenuItemPropsTypeCustom[] = [
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconAperture,
    href: '/',
    chip: 'New',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Chats',
    icon: IconMessage2,
    href: '/apps/chats',
  },
  {
    id: uniqueId(),
    title: 'History',
    icon: History,
    href: '/apps/history',
  },
  {
    id: uniqueId(),
    title: 'Contacts',
    icon: IconPackage,
    chip: '2',
    chipColor: 'secondary',
    href: '/apps/contacts',
  },
  {
    id: uniqueId(),
    title: 'Calendar',
    icon: IconCalendar,
    href: '/apps/calendar',
  },
  {
    id: uniqueId(),
    title: 'Notes',
    icon: IconNotes,
    href: '/apps/notes',
  },
  {
    id: uniqueId(),
    title: 'Email',
    icon: IconMail,
    href: '/apps/email',
  },
  {
    id: uniqueId(),
    title: 'Account Setting',
    icon: IconUserCircle,
    href: '/theme-pages/account-settings',
  },
];

export default Menuitems;
