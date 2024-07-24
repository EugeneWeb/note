import DatePicker from "react-datepicker";

import { SetFieldValueType } from "../NotesOptionsFormFields";
import s from "../NotesOptionsFormFields.module.scss";

interface INotesFormDatePickerField {
    value: Date | null;
    name: string;
    label: string;
    setFieldValue: SetFieldValueType;
    readOnly?: boolean;
    disabled?: boolean;
}
export const NotesFormDatePickerField: React.FC<INotesFormDatePickerField> = ({
    value,
    name,
    label,
    setFieldValue,
    readOnly,
    disabled,
}) => (
    <div>
        <label className={s.notesOptionsFormFields__label} htmlFor={name}>
            {label}
        </label>
        <DatePicker
            readOnly={readOnly}
            disabled={disabled}
            selected={value}
            dateFormat="dd.MM.yyyy"
            onChange={(date) => {
                if (date) {
                    return setFieldValue(name, date);
                }
            }}
            className={s.notesOptionsFormFields__input}
            name={name}
        />
    </div>
);