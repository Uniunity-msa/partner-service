"use strict"

const Partner = require("../models/Partner");
const User = require("../models/User");
const Council = require("../models/Council");
const Post = require("../models/Post");
const University = require("../models/University");
const sendEmailWithAuthorization = require("../../mailer");
const bcrypt = require('bcrypt');
const Comment = require('../models/Comment');

const output = {
    partner: (req, res) => {
        res.render("store/partner.html");
    },
    partnerForm: (req, res) => {
        res.render("store/uploadTest.html");
    },
}

//제휴 파트
const partner = {
    getUniversityID: async (req, res) => {
        const partner = new Partner();
        const response = await partner.getUniversityID(req.params.university_url);
        return res.json(response);
    },
    getPartnerUni: async (req, res) => {
        const partner = new Partner();
        const university_id = await partner.getUniversityID(req.body.university_url);
        const response = await partner.getPartnerStores(university_id);
        return res.json(response);
    },
    getUniversityLocation: async (req, res) => {
        const partner = new Partner();
        const university_id = await partner.getUniversityID(req.body.university_url);
        const response = await partner.getUniversityLocation(university_id);
        return res.json(response);
    },
    getPartner: async (req, res) => {
        const partner = new Partner();
        const response = await partner.showUniversity(req.body.university_url);
        const university_id = await partner.getUniversityID(req.body.university_url);
        const university_location = await partner.getUniversityLocation(university_id);
        const university_uni = await partner.getPartnerStores(university_id);
        const obj = [];
        obj.push({ latitudeUni: university_location.latitude, longitudeUni: university_location.longitude });
        for (let i = 0; i < university_uni.length; i++) {
            obj.push(university_uni[i]);
        }
        return res.json(obj);
    },
    getUniversityID_name: async (req, res) => {
        const partner = new Partner();
        const response = await partner.getUniversityID(req.params.university_url);
        return res.json(response);
    },
    uploadPartnerStore: async (req, res) => {
        const partner = new Partner();
        const storeName = req.body.storeName,
            store_location = req.body.store_location,
            latitude = req.body.latitude,
            longitude = req.body.longitude,
            content = req.body.content,
            startDate = req.body.startDate,
            endDate = req.body.endDate;
        const university_id = await partner.getUniversityID(req.body.university_url);
        const response = await partner.uploadPartnerStore(storeName, store_location, latitude, longitude, university_id, content, startDate, endDate);
        return res.json(response);
    },
    DeletePartnerStore: async (req, res) => {
        const partner = new Partner();
        const response = await partner.DeletePartnerStore(req.params.storeID);
        return res.json(response);
    }
};

// 소상공인 파트
const retailer = {
    retailer: async (req, res) => {
        res.render("store/retailer.html");
    },
    retailerKind: async (req, res) => {
        if (req.params.kind == 'all') {
            res.render("store/retailer.html");
        }
        else if (req.params.kind == 'food') {
            res.render("store/reatailerFood.html");
        }
        else if (req.params.kind == 'cafe') {
            res.render("store/retailerCafe.html")
        }
        else {
            res.render("store/retailer.html");
        }
    },
}



module.exports = {
    output,
    process,
    result,
    partner,
    retailer,
};
