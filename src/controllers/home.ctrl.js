"use strict"

const Partner = require("../models/Partner");
const bcrypt = require('bcrypt');

const output = {
    partner: (req, res) => {
        res.render("partner.html");
    },
    partnerForm: (req, res) => {
        res.render("uploadTest.html");
    },
    retailer: async (req, res) => {
        res.render("retailer.html");
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
        // const response = await partner.showUniversity(req.body.university_url);
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
        const partner_name = req.body.partner_name,
            address = req.body.address,
            latitude = req.body.latitude,
            longitude = req.body.longitude,
            content = req.body.content,
            start_period = req.body.start_period,
            end_period = req.body.end_period;
        const university_id = await partner.getUniversityID(req.body.university_url);
        const response = await partner.uploadPartnerStore(partner_name, content, start_period, end_period, address, university_id, latitude, longitude);
        return res.json(response);
    },
    DeletePartnerStore: async (req, res) => {
        const partner = new Partner();
        const response = await partner.DeletePartnerStore(req.params.partner_id);
        return res.json(response);
    }
};

// 소상공인 파트
// 분류 기능 자체를 삭제함
// const retailer = {
//     retailer: async (req, res) => {
//         res.render("retailer.html");
//     },
//     retailerKind: async (req, res) => {
//         if (req.params.kind == 'all') {
//             res.render("retailer.html");
//         }
//         else if (req.params.kind == 'food') {
//             res.render("reatailerFood.html");
//         }
//         else if (req.params.kind == 'cafe') {
//             res.render("retailerCafe.html")
//         }
//         else {
//             res.render("retailer.html");
//         }
//     },
// }

const university = {
    getUniversityName: async (req, res) => {
        const partner = new Partner();
        const response = await partner.getUniversityName(req.body.university_url);
        return res.json(response);
    }
}

module.exports = {
    output,
    partner,
    university
};
