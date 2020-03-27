const advancedResult = (model, populate) => async (req, res, next) => {
  let query
  // copy req.query
  const reqQuery = { ...req.query }
  // Fields to exclude like select
  const removeFields = ['select', 'sort', 'page', 'limit']
  // loop over the removeFields and delete them from the reqQuery
  removeFields.forEach(params => delete reqQuery[params])
  // this is used to add the money sign to the query string so that you may be able find the corresponding value based on the data in the query
  let queryStr = JSON.stringify(reqQuery)

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  )
  query = model.find(JSON.parse(queryStr))
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',')
    query = query.select(fields)
  }
  // this is for the sorting of the fielda - means asc + desc
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }
  // adding the pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()
  query = query.skip(startIndex).limit(limit)
  if (populate) {
    query = query.populate(populate)
  }
  // console.log(query)
  const results = await query
  // Pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    }
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }
  next()
}

module.exports = advancedResult
