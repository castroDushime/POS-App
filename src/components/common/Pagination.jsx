import React from 'react';
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {useTranslation} from 'react-i18next';

const Pagination = ({ from, to, totalItems, currentPage, totalPages, handlePrevPage, handleNextPage, setCurrentPage }) => {
    const {t, i18n} = useTranslation();
    return (
        <nav>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="tw-text-xs">{t('Showing')} {from} {t('to')} {to} {t('of')} {totalItems} {t('entries')}</div>
                <ul className="pagination tw-float-end">
                    <li className="page-item tw-text-xs">
                        <button
                            className="page-link"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            <IconChevronLeft size={14} />
                        </button>
                    </li>
                    {[...Array(totalPages).keys()].map(page => (
                        (totalPages <= 5 || page === 0 || page === totalPages - 1 || (page >= currentPage - 1 && page <= currentPage + 1)) ? (
                            <li key={page} className={`page-item tw-text-xs ${currentPage === page + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(page + 1)}>
                                    {page + 1}
                                </button>
                            </li>
                        ) : (
                            (page === 1 || page === totalPages - 2) && <li key={page} className={`page-item tw-text-xs`}><span className="page-link">..</span></li>
                        )
                    ))}
                    <li className="page-item tw-text-xs">
                        <button
                            className="page-link"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            <IconChevronRight size={14} />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Pagination;
