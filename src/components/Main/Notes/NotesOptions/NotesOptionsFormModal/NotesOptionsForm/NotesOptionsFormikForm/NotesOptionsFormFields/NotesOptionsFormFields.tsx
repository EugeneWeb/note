import { FormikErrors } from "formik";
import { FC } from "react";

import { useAppSelector } from "../../../../../../../../hooks/useAppSelector";
import { cls, userRoleLabels } from "../../../../../../../../utils/helpers";
import { NotesOptionsFormValues } from "../../NotesOptionsForm";
import NoteInfoFieldset from "./NoteInfoFieldset/NoteInfoFieldset";
import { NotesFormTextField } from "./NotesFormTextField/NotesFormTextField";
import PeopleInfoFieldset from "./PeopleInfoFieldset/PeopleInfoFieldset";
import s from "./NotesOptionsFormFields.module.scss";

export type SetFieldValueType = (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<NotesOptionsFormValues>>;
export type LabelFieldsType = Record<keyof NotesOptionsFormValues, string>;

interface INotesOptionsFormFields {
    errors: FormikErrors<NotesOptionsFormValues>;
    status: { message: string };
    values: NotesOptionsFormValues;
    setFieldValue: SetFieldValueType;
    isReadOnly: boolean;
}
export const NotesOptionsFormFields: FC<INotesOptionsFormFields> = ({
    errors,
    status,
    values,
    setFieldValue,
    isReadOnly,
}) => {
    const notesOptionsEditMode = useAppSelector(
        (state) => state.notes.notesOptionsEditMode
    );
    const currentUserRole = useAppSelector(
        (state) => state.auth.currentUser.role
    );

    const labelFields: LabelFieldsType = {
        number: "Номер",
        createdAt: "Дата создания",
        reg_date: "Рег. дата",
        status: "Статус",
        to_whom: "Кому",
        reg_num: "Рег. номер",
        summary: "Краткое содержание",
        desc: "Описание",
        comment: "Комментарий",
        ...userRoleLabels,
    };

    const getErrorString = (errors: FormikErrors<NotesOptionsFormValues>) => {
        const keysArray = Object.keys(
            errors
        ) as (keyof NotesOptionsFormValues)[];
        if (keysArray.length === 0) return "";

        const valuesArray = keysArray.map((key) => labelFields[key]);
        return `Не заполнены обязательные атрибуты: ${valuesArray.join(", ")}`;
    };

    const isPeopleInfoInputDisabled =
        (notesOptionsEditMode && currentUserRole !== "executor") || isReadOnly;
    const isRegistrarsInputDisabled =
        currentUserRole !== "registrar" && !isReadOnly;
    return (
        <div className={s.notesOptionsFormFields}>
            {(errors || status) && (
                <div className={s.notesOptionsFormFields__status}>
                    {status && status.message
                        ? status.message
                        : getErrorString(errors)}
                </div>
            )}

            <NoteInfoFieldset
                createdAt={values.createdAt}
                reg_date={values.reg_date}
                isRegistrarsInputDisabled={isRegistrarsInputDisabled}
                isReadOnly={isReadOnly}
                labelFields={labelFields}
                setFieldValue={setFieldValue}
            />

            <NotesFormTextField
                name="summary"
                label={labelFields.summary}
                readOnly={isReadOnly}
                wrapClassName={cls([
                    s.notesOptionsFormFields__field,
                    s["notesOptionsFormFields__margin-bottom"],
                ])}
            />

            <PeopleInfoFieldset
                isPeopleInfoInputDisabled={isPeopleInfoInputDisabled}
                isReadOnly={isReadOnly}
                labelFields={labelFields}
            />

            <NotesFormTextField
                name="desc"
                label={labelFields.desc}
                readOnly={isReadOnly}
                wrapClassName={cls([
                    s.notesOptionsFormFields__field,
                    s["notesOptionsFormFields__margin-bottom"],
                ])}
                as="textarea"
            />

            <NotesFormTextField
                name="comment"
                label={labelFields.comment}
                readOnly={isReadOnly}
                wrapClassName={s.notesOptionsFormFields__field}
            />
        </div>
    );
};
