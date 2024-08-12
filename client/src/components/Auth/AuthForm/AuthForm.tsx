import { Formik, FormikHelpers} from "formik";
import { FC } from "react";
import { Navigate } from "react-router-dom";

import { useActions } from "../../../hooks/useActions";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { AuthFormikForm } from "./AuthFormikForm/AuthFormikForm";

export type AuthFormValues = {
    login: string;
    password: string;
};
export const AuthForm: FC = () => {
    const isAuth = useAppSelector((state) => state.auth.isAuth);
    const { setCurrentUser } = useActions();

    if (isAuth) return <Navigate to="/" />;

    const handleSubmit = (
        values: AuthFormValues,
        { setSubmitting, setStatus }: FormikHelpers<AuthFormValues>
    ) => {
        if (values.login !== "user" || values.password !== "qwerty") {
            setStatus({ message: "Неверно введен логин или пароль." });
        } else setCurrentUser();

        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ login: "", password: "" }}
            onSubmit={handleSubmit}
        >
            {(props) => <AuthFormikForm {...props} />}
        </Formik>
    );
};

