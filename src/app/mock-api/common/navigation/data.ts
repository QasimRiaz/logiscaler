/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const superAdminNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard'
    },
    {
        id: 'event',
        title: 'Roles',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/roles',
    },
    // {
    //     id: 'Tasks',
    //     title: 'Taken',
    //     type: 'basic',
    //     icon: 'heroicons_outline:viewfinder-circle',
    //     link: '/task',
    // },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            // {
            //     id: 'assetOwners',
            //     title: 'Asset Owners',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office',
            //     link: '/assetOwners',
            // },
            // {
            //     id: 'contractors',
            //     title: 'Contractors',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office-2',
            //     link: '/contractors',
            // },
            {
                id: 'Users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/users',
            }
        ],
    },
    // {
    //     id: 'Help',
    //     title: 'Help',
    //     type: 'basic',
    //     icon: 'heroicons_outline:window',
    //     link: 'https://docs.google.com/presentation/d/e/2PACX-1vRiIri9bA2rFPYds6bPGR39ZtFomDbimF_lHeE_rK_q0mwz5E0Yu6llZ2ldNtxr4ONFwDNKlsadwyCk/pub?start=true&loop=false&delayms=60000',
    //     externalLink: true,
    //     target: '_blank'
    // },
];
export const assetOwnerNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard'
    },
    // {
    //     id: 'event',
    //     title: 'Project',
    //     type: 'basic',
    //     icon: 'heroicons_outline:calendar',
    //     link: '/projects',
    // },
    // {
    //     id: 'Reports',
    //     title: 'Rapporten',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [
    //         {
    //             id: 'Project Progress',
    //             title: 'Projectvoortgang',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/reports/project',
    //         }
    //     ],
    // },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            // {
            //     id: 'assetOwners',
            //     title: 'Asset Owners',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office',
            //     link: '/assetOwners',
            // },
            // {
            //     id: 'contractors',
            //     title: 'Contractors',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office-2',
            //     link: '/contractors',
            // },
            {
                id: 'Users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/users',
            }
        ],
    },
    // {
    //     id: 'Help',
    //     title: 'Help',
    //     type: 'basic',
    //     icon: 'heroicons_outline:window',
    //     link: 'https://docs.google.com/presentation/d/e/2PACX-1vRiIri9bA2rFPYds6bPGR39ZtFomDbimF_lHeE_rK_q0mwz5E0Yu6llZ2ldNtxr4ONFwDNKlsadwyCk/pub?start=true&loop=false&delayms=60000',
    //     externalLink: true,
    //     target: '_blank'
    // },
];
export const contractorNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard'
    },
    // {
    //     id: 'Projects',
    //     title: 'Projecten',
    //     type: 'basic',
    //     icon: 'heroicons_outline:calendar',
    //     link: '/projects',
    // },
    // {
    //     id: 'Reports',
    //     title: 'Rapporten',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [
    //         {
    //             id: 'Project Progress',
    //             title: 'Projectvoortgang',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/reports/project',
    //         }
    //     ],
    // },
    {
        id: 'accounts',
        title: 'User Management',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            // {
            //     id: 'assetOwners',
            //     title: 'Asset Owners',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office',
            //     link: '/assetOwners',
            // },
            // {
            //     id: 'contractors',
            //     title: 'Contractors',
            //     type: 'basic',
            //     icon: 'heroicons_outline:building-office-2',
            //     link: '/contractors',
            // },
            {
                id: 'Users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/users',
            }
        ],
    },
    // {
    //     id: 'Help',
    //     title: 'Help',
    //     type: 'basic',
    //     icon: 'heroicons_outline:window',
    //     link: 'https://docs.google.com/presentation/d/e/2PACX-1vRiIri9bA2rFPYds6bPGR39ZtFomDbimF_lHeE_rK_q0mwz5E0Yu6llZ2ldNtxr4ONFwDNKlsadwyCk/pub?start=true&loop=false&delayms=60000',
    //     externalLink: true,
    //     target: '_blank'
    // },

];
export const taskSubmitterNav: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard'
    },
    // {
    //     id: 'Projects',
    //     title: 'Projecten',
    //     type: 'basic',
    //     icon: 'heroicons_outline:calendar',
    //     link: '/projects',
    // },
    // {
    //     id: 'Reports',
    //     title: 'Rapporten',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [
    //         {
    //             id: 'Project Progress',
    //             title: 'Projectvoortgang',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/reports/project',
    //         }
    //     ],
    // },
    // {
    //     id: 'Help',
    //     title: 'Help',
    //     type: 'basic',
    //     icon: 'heroicons_outline:window',
    //     link: 'https://docs.google.com/presentation/d/e/2PACX-1vRiIri9bA2rFPYds6bPGR39ZtFomDbimF_lHeE_rK_q0mwz5E0Yu6llZ2ldNtxr4ONFwDNKlsadwyCk/pub?start=true&loop=false&delayms=60000',
    //     externalLink: true,
    //     target: '_blank'
    // },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];

