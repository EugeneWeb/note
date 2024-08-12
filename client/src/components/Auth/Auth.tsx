import { FC } from 'react';

import s from './Auth.module.scss'
import { AuthForm } from './AuthForm/AuthForm';

export const Auth: FC = () => {
    return (
        <div className={s.auth}>
            <AuthForm />
        </div>
    );
};


