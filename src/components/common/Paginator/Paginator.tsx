import { FC, useState } from "react";

import arrowLeft from '../../../assets/img/icons/arrow_left.svg'
import arrowRight from '../../../assets/img/icons/arrow_right.svg'
import { cls } from "../../../utils/helpers";
import s from "./Paginator.module.scss";

type PropsType = {
    totalItemsCount: number,
    perPage: number,
    currentPage: number,
    onChangePage: (pageNum: number) => void,
    portionSize?: number,
}
export const Paginator: FC<PropsType> = ({
    totalItemsCount,
    perPage,
    currentPage,
    onChangePage,
    portionSize = 5,
}) => {
    const pagesCount = Math.ceil(totalItemsCount / perPage);
    const pages = [] as number[];
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    const portionCount = Math.ceil(pagesCount / portionSize);
    const [portionNumber, setPortionNumber] = useState(1);

    const leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    const rightPortionPageNumber = portionNumber * portionSize; 

    return (
        <div className={s.paginator}>
            {portionNumber > 1 && (
                <button
                    onClick={() => setPortionNumber(portionNumber - 1)}
                    className={s.paginator__arrow}
                >
                    <img src={arrowLeft} alt="left arrow" />
                </button>
            )}

            {pages
                .filter(
                    (p) =>
                        p >= leftPortionPageNumber &&
                        p <= rightPortionPageNumber
                )
                .map((pageNum) => (
                    <button
                        className={
                            currentPage === pageNum
                                ? cls([s.paginator__selectedPage, s.paginator__pageBtn])
                                : s.paginator__pageBtn
                        }
                        key={pageNum}
                        onClick={() => {
                            onChangePage(pageNum);
                        }}
                    >
                        {pageNum}
                    </button>
                ))}

            {portionCount > portionNumber && (
                <button
                    onClick={() => setPortionNumber(portionNumber + 1)}
                    className={s.paginator__arrow}
                >
                    <img src={arrowRight} alt="right arrow" />
                </button>
            )}
        </div>
    );
};
