import { FC } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

import { useActions } from "../../../../../../../../hooks/useActions";
import { UserRole } from "../../../../../../../../types/user.types";
import { cls } from "../../../../../../../../utils/helpers";
import { SubmitButtons } from "../../NotesOptionsForm";
import s from "./NotesOptionsFormBtns.module.scss";

interface INotesOptionsFormBtns {
    notesOptionsEditMode: boolean;
    userRole: UserRole;
    isReadOnly: boolean;
    isSubmitting: boolean;
}
export const NotesOptionsFormBtns: FC<INotesOptionsFormBtns> = ({
    notesOptionsEditMode,
    userRole,
    isReadOnly,
    isSubmitting,
}) => {
    const { setSubmitBtnClicked } = useActions();

    const btnText = {
        registrar: "Зарегистрировать",
        signatory: "Подписать",
        approver: "Согласовать",
    } as const;

    const isDisabled = isReadOnly || isSubmitting;
    return (
        <div className={s.notesOptionsFormBtns}>
            {notesOptionsEditMode &&
                (userRole === "executor" ? (
                    <div className={s["notesOptionsFormBtns__btn-group"]}>
                        {createSubmitBtn(
                            "На согласование",
                            setSubmitBtnClicked,
                            isDisabled
                        )}

                        {createSubmitBtn(
                            "На регистрацию",
                            setSubmitBtnClicked,
                            isDisabled
                        )}
                    </div>
                ) : (
                    <div className={s["notesOptionsFormBtns__btn-group"]}>
                        {createSubmitBtn(
                            "Отклонить",
                            setSubmitBtnClicked,
                            isDisabled,
                            s["notesOptionsFormBtns__btn--red"]
                        )}
                        {createSubmitBtn(
                            btnText[userRole],
                            setSubmitBtnClicked,
                            isDisabled,
                            s["notesOptionsFormBtns__btn--green"]
                        )}
                    </div>
                ))}
            {notesOptionsEditMode ? (
                createSubmitBtn("Печать", setSubmitBtnClicked, isSubmitting)
            ) : (
                <div></div>
            )}
            <div className={s["notesOptionsFormBtns__btn-group"]}>
                {createSubmitBtn(
                    "Закрыть",
                    setSubmitBtnClicked,
                    isSubmitting,
                    s.notesOptionsFormBtns__close
                )}

                {createSubmitBtn(
                    "Сохранить",
                    setSubmitBtnClicked,
                    isDisabled,
                    s.notesOptionsFormBtns__close
                )}
            </div>
        </div>
    );
};

const createSubmitBtn = (
    btnText: SubmitButtons,
    setSubmitBtnClicked: ActionCreatorWithPayload<SubmitButtons>,
    isDisabled: boolean,
    btnClassName?: string
) => (
    <button
        className={cls([s.notesOptionsFormBtns__btn, btnClassName])}
        disabled={isDisabled}
        onClick={() => setSubmitBtnClicked(btnText)}
        type="submit"
    >
        {btnText}
    </button>
);
