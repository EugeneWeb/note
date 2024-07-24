import { FC } from "react";

import { cls } from "../../../../../../../../../utils/helpers";
import { NotesFormDatePickerField } from "../NotesFormDatePickerField/NotesFormDatePickerField";
import { NotesFormTextField } from "../NotesFormTextField/NotesFormTextField";
import { LabelFieldsType, SetFieldValueType } from "../NotesOptionsFormFields";
import s from "../NotesOptionsFormFields.module.scss";

interface INoteInfoFieldset {
    createdAt: Date | null;
    reg_date: Date | null;
    setFieldValue: SetFieldValueType;
    isReadOnly: boolean;
    isRegistrarsInputDisabled: boolean;
    labelFields: LabelFieldsType
}
const NoteInfoFieldset: FC<INoteInfoFieldset> = ({
    createdAt,
    reg_date,
    isReadOnly,
    isRegistrarsInputDisabled,
    setFieldValue,
    labelFields
}) => {
    return (
        <fieldset
            className={cls([
                s["notesOptionsFormFields__note-info"],
                s["notesOptionsFormFields__margin-bottom"],
                s.notesOptionsFormFields__fieldset,
            ])}
        >
            <NotesFormTextField
                name="number"
                label={labelFields.number}
                readOnly={true}
            />

            <NotesFormDatePickerField
                value={createdAt}
                name="createdAt"
                label={labelFields.createdAt}
                setFieldValue={setFieldValue}
                readOnly={isReadOnly}
            />

            <NotesFormTextField
                name="reg_num"
                label={labelFields.reg_num}
                readOnly={isReadOnly}
                disabled={isRegistrarsInputDisabled}
            />

            <NotesFormDatePickerField
                value={reg_date}
                name="reg_date"
                label={labelFields.reg_date}
                setFieldValue={setFieldValue}
                readOnly={isReadOnly}
                disabled={isRegistrarsInputDisabled}
            />
        </fieldset>
    );
};

export default NoteInfoFieldset;
