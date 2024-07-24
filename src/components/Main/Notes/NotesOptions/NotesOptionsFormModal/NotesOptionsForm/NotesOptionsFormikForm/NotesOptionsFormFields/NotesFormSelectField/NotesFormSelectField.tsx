import { Field } from "formik";

import { cls } from "../../../../../../../../../utils/helpers";
import s from "../NotesOptionsFormFields.module.scss";

interface INotesFormSelectField {
    name: string;
    label: string;
    options: string[];
    readOnly?: boolean;
    disabled?: boolean;
}
export const NotesFormSelectField: React.FC<INotesFormSelectField> = ({ name, label, options, readOnly, disabled }) => (
    <div className={s["notesOptionsFormFields__people-info--check"]}>
        <label className={s.notesOptionsFormFields__label} htmlFor={name}>
            {label}
        </label>
        <Field
            as="select"
            className={cls([
                s.notesOptionsFormFields__select,
                readOnly && s["notesOptionsFormFields__select--readOnly"],
            ])}
            name={name}
            disabled={disabled}
        >
            <option value="">Не выбран</option>
            {options.map((option, index) => (
                <option key={`${option} ${index}`} value={option}>
                    {option}
                </option>
            ))}
        </Field>
    </div>
);