exports.getPagination = (page, limits) => {
	const limit = limits || 10;
	const offset = limit * (page - 1);
	return { limit, offset };
};

exports.getPagingData = (data, page, limit, offset) => {
	const { count: totalResults, rows: results } = data;
	const currentPage = page;
	const perPage = limit;
	const totalPages = Math.ceil(totalResults / limit);
	return { results, totalResults, totalPages, currentPage, perPage, offset };
};

exports.paginateArray = (array, page, limit) => {
    const start = 0;
    return array.slice(start,  ((page) *limit));
}

exports.paginateArrayOffsetBased = (array, page, limit) => {
    const start = (page - 1) * limit;
    const end = page * limit;
    return array.slice(start, end);
};
