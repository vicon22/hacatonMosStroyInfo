'use client'

import { useTranslation } from 'react-i18next';
import { Button, Divider, Icon, Text, User } from '@gravity-ui/uikit';
import { BookOpen, Files, Geo, House, PersonWorker, Plus, Rocket, Trolley } from '@gravity-ui/icons';
import { Nav } from './components/Nav/Nav';
import st from './layout.module.css';
import { memo, ReactNode } from 'react';
import { useSelfUserData } from '@/entities/user/hooks';
import Link from 'next/link';

type LayoutProps = {
    children: ReactNode;
}

export const Layout = memo(function Layout(props: LayoutProps) {
    const {t} = useTranslation();
    const user = useSelfUserData();
    const fullName = `${user.data?.first_name} ${user.data?.last_name}`;

    return (
        <div className={st.layout}>
            <main className={st.main}>
                {props.children}
            </main>
            <aside className={st.aside}>
                <Link href='/'>
                    <Text className={st.home} variant='display-1'>
                        <Icon data={PersonWorker} size={24}/>
                        foreman
                    </Text>
                </Link>

                <Divider />

                <User
                    className={st.unit}
                    avatar={{text: fullName, theme: 'brand'}}
                    name={fullName}
                    size="l"
                />

                <Divider />

                <Nav
                    className={st.primary}
                    links={[
                        {title: t('nav.dashboard'), icon: <Icon data={House}/>, href: '/'},
                        {title: t('nav.blueprints'), icon: <Icon data={Geo}/>, href: '/blueprints'},
                        {title: t('nav.projects'), icon: <Icon data={Rocket}/>, href: '/projects'},
                        {title: t('nav.documents'), icon: <Icon data={Files}/>, href: '/docs'}
                    ]}
                />

                <Divider />

                <Nav
                    links={[
                        {title: t('nav.services'), icon: <Icon data={Trolley}/>, href: '/services'},
                        {title: t('nav.wiki'), icon: <Icon data={BookOpen}/>, href: '/wiki'},
                    ]}
                />
            </aside>
        </div>
    );
});