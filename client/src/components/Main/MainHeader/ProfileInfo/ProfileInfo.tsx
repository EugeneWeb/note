import { FC } from "react";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import { userRoleLabels } from "../../../../utils/helpers";
import avatarTestIcon from "../../../../assets/img/background/avatar.png";
import s from "./ProfileInfo.module.scss";

interface IProfileInfo {}
export const ProfileInfo: FC<IProfileInfo> = () => {
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    return (
        <div className={s.profile}>
            <div className={s.profile__icon}>
                <img src={avatarTestIcon} alt="avatar icon" />
            </div>

            <p>{userRoleLabels[currentUser.role]}</p>
        </div>
    );
};
