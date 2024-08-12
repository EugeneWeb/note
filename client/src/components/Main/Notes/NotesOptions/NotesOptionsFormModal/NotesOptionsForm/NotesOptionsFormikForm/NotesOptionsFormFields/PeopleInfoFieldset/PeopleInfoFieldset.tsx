import { FC } from "react";

import { cls } from "../../../../../../../../../utils/helpers";
import { NotesFormSelectField } from "../NotesFormSelectField/NotesFormSelectField";
import { NotesFormTextField } from "../NotesFormTextField/NotesFormTextField";
import { LabelFieldsType } from "../NotesOptionsFormFields";
import s from "../NotesOptionsFormFields.module.scss";

interface IPeopleInfoFieldset {
    labelFields: LabelFieldsType
    isReadOnly: boolean;
    isPeopleInfoInputDisabled: boolean;
}
const PeopleInfoFieldset: FC<IPeopleInfoFieldset> = ({
    isPeopleInfoInputDisabled,
    isReadOnly,
    labelFields
}) => {
    return (
        <fieldset
            className={cls([
                s["notesOptionsFormFields__people-info"],
                s["notesOptionsFormFields__margin-bottom"],
                s.notesOptionsFormFields__fieldset,
            ])}
        >
            <NotesFormTextField
                name="to_whom"
                label={labelFields.to_whom}
                readOnly={isReadOnly}
            />
            <NotesFormSelectField
                name="executor"
                label={labelFields.executor}
                options={["Vladislav_e", "stanislav", "ollleg"]}
                readOnly={isReadOnly}
                disabled={isPeopleInfoInputDisabled}
            />
            <NotesFormSelectField
                name="approver"
                label={labelFields.approver}
                options={["Maria_v", "dmitriyn", "pavel100"]}
                readOnly={isReadOnly}
                disabled={isPeopleInfoInputDisabled}
            />
            <NotesFormSelectField
                name="signatory"
                label={labelFields.signatory}
                options={["pavel3", "vladimir27", "varvara"]}
                readOnly={isReadOnly}
                disabled={isPeopleInfoInputDisabled}
            />
            <NotesFormSelectField
                name="registrar"
                label={labelFields.registrar}
                options={["reg_anton", "alexey", "valeriy"]}
                readOnly={isReadOnly}
                disabled={isPeopleInfoInputDisabled}
            />
        </fieldset>
    );
};

export default PeopleInfoFieldset;
