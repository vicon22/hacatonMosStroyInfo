'use client'

import { useTranslation } from 'react-i18next';
import { Button, Divider, Icon, Text, User } from '@gravity-ui/uikit';
import { BookOpen, Files, House, PersonWorker, Plus, Trolley } from '@gravity-ui/icons';
import { Nav } from './components/Nav/Nav';
import st from './layout.module.css';
import { memo, ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
}

export const Layout = memo(function Layout(props: LayoutProps) {
    const {t} = useTranslation();

    return (
        <div className={st.layout}>
            <main className={st.main}>
                {props.children}
            </main>
            <aside className={st.aside}>

                <Text className={st.home} variant='display-1'>
                    <Icon data={PersonWorker} size={24}/>
                    foreman
                </Text>

                <Divider />

                <User
                    className={st.unit}
                    avatar={{text: 'Charles Darwin', theme: 'brand'}}
                    name="Charles Darwin"
                    description="charles@mail.ai"
                    size="l"
                />

                <Divider />

                <div className={st.unit}>
                    <Button width='max' pin='circle-circle' size='xl' view='outlined-action'>
                        <Icon data={Plus}/>
                        {t('projects.create')}
                    </Button>
                </div>

                <Divider />

                <Nav
                    className={st.primary}
                    links={[
                        {title: t('nav.dashboard'), icon: <Icon data={House}/>, href: '/'},
                        {title: t('nav.projects'), icon: <Icon data={PersonWorker}/>, href: '/projects'},
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