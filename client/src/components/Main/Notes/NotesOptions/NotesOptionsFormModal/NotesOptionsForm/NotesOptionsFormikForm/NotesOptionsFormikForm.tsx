import { FormikProps, Form } from "formik";
import { FC, useMemo } from "react";

import { useAppSelector } from "../../../../../../../hooks/useAppSelector";
import { NotesStatuses } from "../../../../../../../utils/notes-statuses";
import { NotesOptionsFormValues } from "../NotesOptionsForm";
import { NotesOptionsFormBtns } from "./NotesOptionsFormBtns/NotesOptionsFormBtns";
import { NotesOptionsFormFields } from "./NotesOptionsFormFields/NotesOptionsFormFields";
import { NotesOptionsFormHeader } from "./NotesOptionsFormHeader/NotesOptionsFormHeader";
import s from "./NotesOptionsFormikForm.module.scss";

interface INotesOptionFormikForm extends FormikProps<NotesOptionsFormValues> {
    notesOptionsEditMode: boolean;
}
export const NotesOptionFormikForm: FC<INotesOptionFormikForm> = ({
    errors,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    status,
    values,
    notesOptionsEditMode,
}) => {
    const currentUserRole = useAppSelector(
        (state) => state.auth.currentUser.role
    );

    let isReadOnly = false;
    if (notesOptionsEditMode) {
        switch (values.status) {
            case NotesStatuses.APPROVING:
                isReadOnly = currentUserRole !== "approver";
                break;
            case NotesStatuses.SIGNING:
                isReadOnly = currentUserRole !== "signatory";
                break;
            case NotesStatuses.REGISTRATING:
                isReadOnly = currentUserRole !== "registrar";
                break;

            default:
                isReadOnly = false;
        }
    }

    const FormHeader = useMemo(
        () => (
            <NotesOptionsFormHeader
                notesOptionsEditMode={notesOptionsEditMode}
                number={values.number}
                status={values.status}
                isReadOnly={isReadOnly}
            />
        ),
        [values.number, values.status, notesOptionsEditMode, isReadOnly]
    );

    const FormBtns = useMemo(
        () => (
            <NotesOptionsFormBtns
                isReadOnly={isReadOnly}
                isSubmitting={isSubmitting}
                notesOptionsEditMode={notesOptionsEditMode}
                userRole={currentUserRole}
            />
        ),
        [isReadOnly, currentUserRole, notesOptionsEditMode, isSubmitting]
    );

    const FormFields = useMemo(
        () => (
            <NotesOptionsFormFields
                errors={errors}
                isReadOnly={isReadOnly}
                setFieldValue={setFieldValue}
                status={status}
                values={values}
            />
        ),
        [errors, isReadOnly, values, setFieldValue, status]
    );

    return (
        <Form className={s.notesOptionsFormikForm} onSubmit={handleSubmit}>
            {FormHeader}
            {FormFields}
            {FormBtns}
        </Form>
    );
};
