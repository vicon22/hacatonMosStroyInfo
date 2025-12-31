'use client'

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/features/auth/hooks';
import st from './SignIn.module.css';
import { validateLogin } from './SigIn.utils';
import { Button, Card, Icon, PasswordInput, Text, TextInput, useToaster } from '@gravity-ui/uikit';
import { PersonWorker } from '@gravity-ui/icons';
import { LoginFields } from './SignIn.types';
import useKeyPress from '@/shared/hooks/useKeyPress';

export default function SignIn() {
    const { t } = useTranslation();
    const {add} = useToaster();
    const router = useRouter();
    const [formData, setFormData] = useState<Record<LoginFields, string>>({
        [LoginFields.password]: '',
        [LoginFields.email]: ''
    });
    const [formErrors, setFormErrors] = useState<Partial<Record<LoginFields, boolean>>>({});
    
    const loginMutation = useLoginMutation({
        onSuccess: async response => {
            if (response.ok) {
                router.push('/projects');
            } else {
                add({
                    name: 'loginError',
                    title: t('admission.login.errors.credentials'),
                    autoHiding: 2000,
                    isClosable: false,
                    theme: 'danger'
                });
            }
        }
    });

    const onLogin = useCallback(() => {
        const errors = validateLogin(formData);
        const isValid = !Object.keys(errors).filter(key => !!errors[key]).length;

        setFormErrors(prev => ({
            ...prev,
            ...errors,
        }));

        if (isValid) {
            loginMutation.mutate({
                password: formData.password,
                email: formData.email
            });
        }
    }, [loginMutation, formData]);

    const onFormChange = useCallback((payload: Record<string, string>) => {
        setFormErrors({
            ...formErrors,
            ...Object.keys(payload).reduce<Record<string, boolean>>((acc, key) => {
                acc[key] = false;

                return acc;
            }, {})
        });

        setFormData({
            ...formData,
            ...payload,
        });
    }, [formData, formErrors]);

    useKeyPress({ Enter: onLogin });

    return (
        <div className={st.layout}>
            <Card className={st.form} view='filled'>
                <Text className={st.topline} variant='display-3'>
                    <Icon data={PersonWorker} size={36}/>
                    foreman
                </Text>
                
                <div className={st.fields}>
                    <TextInput
                        autoFocus
                        size='xl'
                        value={formData.email || ''}
                        placeholder={t('admission.login.fields.username')}
                        onChange={e => onFormChange({ email: e.target.value.trim() })}
                    />
                    <PasswordInput
                        size='xl'
                        value={formData.password || ''}
                        placeholder={t('admission.login.fields.password')}
                        onChange={e => onFormChange({ password: e.target.value })}
                    />
                </div>

                <div className={st.controls}>
                    <Button
                        pin='circle-circle'
                        selected
                        width='max'
                        size='xl'
                        disabled={!(formData.password?.length && formData.email?.length)}
                        onClick={onLogin}
                    >
                        {t('admission.login.actions.submit')}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
