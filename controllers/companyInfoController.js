const catchAsync = require("../utils/catchAsync");
const CompanyInfo = require("../models/companyInfoModel");
const AppError = require("../utils/appError");
const File = require("../models/fileModel");
const Chunk = require("../models/chunkModel")
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const app = express();



// Mongo URI
const mongoURI = 'mongodb://localhost:27017/schoolAPI';

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});


const multerFilter = async (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        await File.deleteMany()
        await Chunk.deleteMany()
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: multerFilter
});

exports.uploadLogo = upload.single("logo");

exports.createCompanyInfo = catchAsync(async (req, res, next) => {
    const info = await CompanyInfo.find();
    if (info.length) {
        return next(new AppError("all ready exist, please update"), 400)

    }
    const companyInfo = await CompanyInfo.create({ ...req.body, imageName: req.file.filename });

    res.status(201).json({
        status: "Success",
        data: {
            companyInfo
        },
    });
});

exports.getCompanyInfo = catchAsync(async (req, res, next) => {
    const image = await getImage("jaamcad.jpg")
    let companyInfo = await CompanyInfo.findOne();

    res.status(200).json({
        message: "success",
        data: {
            ...companyInfo._doc,
            imageURl: image
        }
    })
});

exports.updateCompanyInfo = catchAsync(async (req, res, next) => {
    const updatedCompanyInfo = await CompanyInfo.findOneAndUpdate({}, { ...req.body, imageName: req.file.filename }, {
        new: true,
        runValidators: true,
    })

    res.status(201).json({
        status: "Success",
        data: {
            updatedCompanyInfo
        },
    });
})

const getImage = (fileName) => {
    return File.find({ filename: fileName })
        .then((file) => {
            const id = mongoose.Types.ObjectId(file[0]._id);
            console.log("File " + file[0].contentType)
            return Chunk.find({ files_id: id })
                .then((chunks) => {
                    if (!chunks || chunks.length === 0) {
                        console.log("No data found");
                    }
                    let fileData = [];
                    for (let i = 0; i < chunks.length; i++) {
                        //This is in Binary JSON or BSON format, which is stored
                        //in fileData array in base64 endocoded string format
                        fileData.push(chunks[i].data.toString('base64'));
                    }

                    //Display the chunks using the data URI format
                    return (finalFile = "data:" + file[0].contentType + ";base64," + fileData.join(""));
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};