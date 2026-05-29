import {
    LayoutDashboard,
    User,
    CreditCard,
    Building2,
    Grid2X2,
    HelpCircle,
    Link2,
    Package,
  } from 'lucide-react'
  
  export const NAV_GROUPS = [
    {
      title: 'Overview',
      items: [
        { to: '/packages',      icon: Package,         label: 'Packages'      },
        { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
      ],
    },
    {
      title: 'Account',
      items: [
        { to: '/profile',       icon: User,        label: 'My Profile'    },
        { to: '/subscriptions', icon: CreditCard,  label: 'Subscriptions' },
      ],
    },
    {
      title: 'Network',
      items: [
        { to: '/providers',     icon: Building2, label: 'My Providers'  },
        { to: '/link-provider', icon: Link2,     label: 'Link Provider' },
      ],
    },
    {
      title: 'More',
      items: [
        { to: '/services', icon: Grid2X2,    label: 'Other Services' },
        { to: '/support',  icon: HelpCircle, label: 'Support & FAQs' },
      ],
    },
  ]