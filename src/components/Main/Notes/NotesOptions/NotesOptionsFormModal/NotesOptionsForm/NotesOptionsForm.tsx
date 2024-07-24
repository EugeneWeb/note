import { FC } from "react";
import { Formik, FormikErrors, FormikHelpers } from "formik";

import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import { parseDate } from "../../../../../../utils/helpers";
import { NotesStatuses } from "../../../../../../utils/notes-statuses";
import { NoteData } from "../../../../../../types/notes.types";
import { useActions } from "../../../../../../hooks/useActions";
import { NotesOptionFormikForm } from "./NotesOptionsFormikForm/NotesOptionsFormikForm";
import { exportNotesOptionsFormToExcel } from "./exportNotesOptionsFormToExcel";

export type NotesOptionsFormValues = {
    number: number;
    createdAt: Date | null;
    reg_date: Date | null;
    status: NotesStatuses | null;
    executor: string;
    signatory: string;
    approver: string;
    registrar: string;
    to_whom: string;
    reg_num: string;
    summary: string;
    desc: string;
    comment: string;
};
export type SubmitButtons =
    | "Сохранить"
    | "На согласование"
    | "На регистрацию"
    | "Отклонить"
    | "Печать"
    | "Закрыть"
    | "Зарегистрировать"
    | "Подписать"
    | "Согласовать";

export const NotesOptionsForm: FC = () => {
    const { notesOptionsEditMode, selectedNote, notes, submitBtnClicked } =
        useAppSelector((state) => state.notes);
    const { editNote, addNote, toggleShowOptionForm } = useActions();

    const validationRequiredFields: Record<
        any,
        (keyof NotesOptionsFormValues)[]
    > = {
        "На регистрацию": ["to_whom", "executor", "registrar"],
        "На согласование": ["to_whom", "executor", "approver"],
        Зарегистрировать: ["reg_date", "reg_num"],
        Отклонить: ["comment"],
    };
    const validateFields = (
        values: NotesOptionsFormValues,
        submitBtnClicked: SubmitButtons
    ) => {
        const errors: FormikErrors<NotesOptionsFormValues> = {};
        const fields = validationRequiredFields[submitBtnClicked] || [];
        const requiredErrorMsg = "Данное поле является обязательным";

        fields.forEach((field) => {
            if (!values[field]) errors[field] = requiredErrorMsg;
        });

        return errors;
    };

    const handleSubmit = async (
        values: NotesOptionsFormValues,
        {
            setErrors,
            setSubmitting,
            setStatus,
        }: FormikHelpers<NotesOptionsFormValues>
    ) => {
        setStatus();

        const errors = validateFields(values, submitBtnClicked);
        if (Object.keys(errors).length) {
            setErrors(errors);
            setSubmitting(false);
            return;
        }

        if (
            submitBtnClicked === "На согласование" &&
            selectedNote.status === NotesStatuses.SIGNED
        ) {
            setStatus({ message: "Служебная записка уже была согласована." });
            setSubmitting(false);
            return;
        }

        const performAction = (status: NotesStatuses | null) => {
            const newNote: NoteData = {
                ...values,
                createdAt: values.createdAt!.toLocaleDateString("ru"),
                reg_date: values.reg_date?.toLocaleDateString("ru"),
            };

            // для actionHandler "Сохранить"
            if (!status) {
                const action = notesOptionsEditMode ? editNote : addNote;
                action(newNote);
                return;
            }

            editNote({
                ...newNote,
                status,
            });
        };

        const actionHandlers: Record<SubmitButtons, () => void> = {
            Сохранить: () => performAction(null),
            "На согласование": () => performAction(NotesStatuses.APPROVING),
            "На регистрацию": () => performAction(NotesStatuses.REGISTRATING),
            Согласовать: () =>
                performAction(
                    values.signatory
                        ? NotesStatuses.SIGNING
                        : NotesStatuses.APPROVED
                ),
            Подписать: () => performAction(NotesStatuses.SIGNED),
            Зарегистрировать: () => performAction(NotesStatuses.REGISTERED),
            Отклонить: () => performAction(NotesStatuses.REVISING),
            Закрыть: () => {},
            Печать: () => exportNotesOptionsFormToExcel(values),
        };

        if (submitBtnClicked) actionHandlers[submitBtnClicked]();
        toggleShowOptionForm();
        setSubmitting(false);
    };

    const isNoteFilled = Object.keys(selectedNote).length > 0;
    return (
        <Formik
            enableReinitialize
            initialValues={
                notesOptionsEditMode && isNoteFilled
                    ? {
                          ...selectedNote,
                          createdAt: parseDate(selectedNote.createdAt),
                          reg_date: parseDate(selectedNote.reg_date),
                      }
                    : {
                          number: notes.length + 1,
                          createdAt: new Date() as Date | null,
                          reg_date: null as Date | null,
                          status: NotesStatuses.CREATED as NotesStatuses | null,
                          executor: "",
                          signatory: "",
                          approver: "",
                          registrar: "",
                          to_whom: "",
                          reg_num: "",
                          summary: "",
                          desc: "",
                          comment: "",
                      }
            }
            onSubmit={handleSubmit}
        >
            {(props) => (
                <NotesOptionFormikForm
                    notesOptionsEditMode={notesOptionsEditMode}
                    {...props}
                />
            )}
        </Formik>
    );
};
