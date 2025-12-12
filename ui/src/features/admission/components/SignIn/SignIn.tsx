'use client'

import { useCallback, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import { useLoginMutation } from '@/features/auth/hooks';

import st from './SignIn.module.css';
import { validateLogin } from './SigIn.utils';
import Login from './components/Form/Login/Login';
import Layout from '../../ui/Layout/Layout';
import { Button } from '@gravity-ui/uikit';

export default function SignIn() {
    const { t } = useTranslation();
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
    const headInputRef = useRef<HTMLInputElement>(null);
    
    const loginMutation = useLoginMutation({
        onSuccess: async response => {
            if (response.ok) {

                console.log({response});
                router.push('/projects');
            }
        },
        onError: async (error) => {
            console.log(error)
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
                username: formData.username
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

    useEffect(() => {
        headInputRef?.current?.focus();
    }, []);


    return (
        <Layout
            decorated
            footer={(
                <div className={st.controls}>
                    <Button
                        size='xl'
                        className={st.button}
                        onClick={onLogin}
                    >
                        {t('admission.sign_in.actions.submit')}
                    </Button>
                </div>
            )}
        >
            <div className={st.form}>
                <div className={st.content}>
                    <div className={st.fields}>
                        <Login
                            values={formData}
                            errors={formErrors}
                            onChange={onFormChange}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
