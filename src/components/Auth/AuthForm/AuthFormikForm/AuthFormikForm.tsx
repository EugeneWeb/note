import { Field, Form, FormikProps } from "formik";
import { FC } from "react";

import { cls } from "../../../../utils/helpers";
import { AuthFormValues } from "../AuthForm";
import s from './AuthFormikForm.module.scss'

interface IAuthFormikForm extends FormikProps<AuthFormValues> {}
export const AuthFormikForm: FC<IAuthFormikForm> = ({
    status,
    handleChange,
    setStatus,
    isSubmitting,
}) => {
    const handleAuthFieldChange = (val: string) => {
        handleChange(val);
        if (status?.message) setStatus({});
    }

    return (
        <Form
            className={cls([
                s.authFormikForm,
                status?.message && s["authFormikForm--error"],
            ])}
        >
            <h1 className={s.authFormikForm__title}>Вход в систему</h1>
            {status?.message && (
                <p className={s.authFormikForm__error}>{status.message}</p>
            )}
            <div className={s.authFormikForm__field}>
                <Field
                    type="text"
                    placeholder="Введите логин"
                    name="login"
                    autoComplete="username"
                    onChange={handleAuthFieldChange}
                />
            </div>
            <div className={s.authFormikForm__field}>
                <Field
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    onChange={handleAuthFieldChange}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={s.authFormikForm__btn}
            >
                Войти
            </button>
        </Form>
    );
};
