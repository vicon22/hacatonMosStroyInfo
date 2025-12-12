import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import st from './Layout.module.css';

type Props = {
    flat?: boolean;
    maintaince?: boolean;
    decorated?: boolean;
    children: ReactElement;
    footer?: ReactElement;
};

export default function Layout(props: Props) {
    const { t } = useTranslation();

    const helpLink =
        process.env.LOCAL_HELP_URL || process.env.NEXT_PUBLIC_HELP_URL;

    return (
        <div className={st.wrap}>
            <div
                className={cn(st.main, {
                    [st.maintaince]: props.maintaince,
                    [st.flat]: props.flat,
                })}
            >
                <div className={st.narrow}>
                    {props.children}
                    <div className={st.footer}>
                        {props.footer}
                    </div>
                </div>
            </div>
        </div>
    );
}
