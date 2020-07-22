// @desc Get all bootcamps
// @route GET /bootcamps/api/v1
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc Get single bootcamp
// @route GET /bootcamps/api/v1/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
};

// @desc Create new bootcamp
// @route POST /bootcamps/api/v1/
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// @desc Update single bootcamp
// @route PUT /bootcamps/api/v1/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp with id ${req.params.id}` });
};

// @desc Delete single bootcamp
// @route GET /bootcamps/api/v1/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp with id ${req.params.id}` });
};
