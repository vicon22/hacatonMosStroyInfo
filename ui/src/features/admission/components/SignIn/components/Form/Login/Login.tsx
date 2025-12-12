import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import st from '../Form.module.css';
import { LoginFields } from '../../../SignIn.types';
import { FormProps } from '../Form.types';
import { PasswordInput, TextInput } from '@gravity-ui/uikit';

export default function Login(props: FormProps<LoginFields>) {
    const { t } = useTranslation();

    const headInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        headInputRef?.current?.focus();
    }, []);

    return (
        <div className={st.fields}>
            <TextInput
                autoFocus
                size='xl'
                ref={headInputRef}
                error={props.errors.username}
                value={props.values.username || ''}
                onChange={e => props.onChange({ username: e.target.value.trim() })}
                label={t('admission.sign_up.fields.email')}
            />
            <PasswordInput
                size='xl'
                value={props.values.password || ''}
                label={t('admission.sign_up.fields.password')}
                onChange={e => props.onChange({ password: e.target.value })}
            />
        </div>
    );
}