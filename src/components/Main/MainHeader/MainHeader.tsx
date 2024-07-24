import { FC } from "react";

import s from "./MainHeader.module.scss";
import { ProfileInfo } from "./ProfileInfo/ProfileInfo";


export const MainHeader: FC = () => {
    return (
        <div className={s.mainHeader}>
            <h1 className={s.mainHeader__title}>Служебные записки</h1>
            <ProfileInfo />
        </div>
    );
};
