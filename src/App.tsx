import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";

import s from "./App.module.scss";
import { Auth } from "./components/Auth/Auth";
import { Main } from "./components/Main/Main";




// проверить 4
// далее readme и github отправить




export const App: FC = () => {
    registerLocale("ru", ru);
    setDefaultLocale("ru");

    return (
        <Router>
            <div className={s.wrap}>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/index.html" element={<Main />} />
                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </div>
        </Router>
    );
};
