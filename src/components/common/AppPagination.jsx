import _ from "lodash";
import {TbChevronLeft, TbChevronRight} from "react-icons/tb";

function AppPagination({total, pageSize, currentPage, onPageChange}) {
    const pagesCount = Math.ceil(total / pageSize);

    let pages = _.range(1, pagesCount + 1);
    if (pages.length > 10) {
        const startPages = pages.slice(0, 3);
        const endPages = pages.slice(-3);
        const currentPages = pages.slice(currentPage - 3, currentPage + 1);
        pages = _.uniq([...startPages, '...', ...currentPages, '...', ...endPages]);
    }

    return (
        <nav className="py-1">
            <div className="pagination pagination-sm">
                <div className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
                    <button type="button" className="page-link  tw-py-2 mx-0 "
                            onClick={() => onPageChange(currentPage - 1)}>
                        <TbChevronLeft size={20}/>
                    </button>
                </div>
                {pages.map((page, index) => (
                    <div key={index} className={page === currentPage ? 'page-item active border-0' : 'page-item'}>
                        <button type="button" className="page-link tw-py-2  border-1 h-100  tw-px-3.5"
                                onClick={() => typeof page === 'number' && onPageChange(page)}>{page}</button>
                    </div>
                ))}
                <div className={currentPage === pagesCount ? 'page-item disabled' : 'page-item'}>
                    <button type="button" className="page-link  tw-py-2"
                            onClick={() => onPageChange(currentPage + 1)}>
                        <TbChevronRight size={20}/>
                    </button>
                </div>
            </div>
        </nav>
    );
}
export default AppPagination;