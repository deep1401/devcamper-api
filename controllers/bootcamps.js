const Bootcamp = require("../models/Bootcamp");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Add user to body
  req.body.user = req.user.id;

  //Check if already published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //Check if published and if role is not admin
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.id !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not allowed to do this operation`,
        400
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.id !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not allowed to do this operation`,
        400
      )
    );
  }

  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc Get Bootcamps by Distance
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  //Calc radius using radians
  //Divide radius by radius of earth i.e. 3963 miles

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload photo in  bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.id !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not allowed to do this operation`,
        400
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure file is an image
  if (!file.mimetype.startsWith("image")) {
    new ErrorResponse("Please upload an image", 400);
  }

  //Check file size
  if (file.size > process.env.FILE_UPLOAD_SIZE) {
    new ErrorResponse(
      `Please upload an image of size less than ${process.env.FILE_UPLOAD_SIZE} bytes`,
      400
    );
  }

  //Custome file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  //Move to the folder
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`An error occured`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
