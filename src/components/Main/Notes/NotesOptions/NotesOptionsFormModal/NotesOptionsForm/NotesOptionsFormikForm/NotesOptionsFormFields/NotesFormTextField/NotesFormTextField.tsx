import { Field } from "formik";

import s from "../NotesOptionsFormFields.module.scss";

interface INotesFormTextField {
    name: string;
    label: string;
    readOnly?: boolean;
    disabled?: boolean;
    wrapClassName?: string;
    as?: string;
}
export const NotesFormTextField: React.FC<INotesFormTextField> = ({
    name,
    label,
    readOnly,
    disabled,
    wrapClassName,
    as,
}) => (
    <div className={wrapClassName}>
        <label className={s.notesOptionsFormFields__label} htmlFor={name}>
            {label}
        </label>
        <Field
            as={as}
            className={s.notesOptionsFormFields__input}
            type="text"
            id={name}
            name={name}
            readOnly={readOnly}
            disabled={disabled}
        />
    </div>
);