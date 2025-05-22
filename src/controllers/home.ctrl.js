"use strict"

const Partner = require("../models/Partner");
const bcrypt = require('bcrypt');
const { sendUniversityURL, receiveUniversityData } = require('../rabbit/rabbitMQ');

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
        try {
            const university_url = req.body.university_url;

            // 통신으로 university_id와 university_location 받아오기
            await sendUniversityURL('SendUniversityID', university_url);
            const university_id = await receiveUniversityDataAsync('RecvUniversityID');

            await sendUniversityURL('SendUniversityLocation', university_url);
            const university_location = await receiveUniversityDataAsync('RecvUniversityLocation');

            const partner = new Partner();
            const university_uni = await partner.getPartnerStores(university_id.university_id); // ID 객체에서 값 꺼냄

            // 응답 객체 구성
            const obj = [];
            obj.push({
            latitudeUni: university_location.university_location.latitude,
            longitudeUni: university_location.university_location.longitude,
            });
            for (let i = 0; i < university_uni.length; i++) {
            obj.push(university_uni[i]);
            }

            return res.json(obj);
        } catch (err) {
            console.error('getPartner error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUniversityID_name: async (req, res) => {
        const partner = new Partner();
        const response = await partner.getUniversityID(req.params.university_url);
        return res.json(response);
    },
    uploadPartnerStore: async (req, res) => {
        try {
            const {
                partner_name,
                address,
                latitude,
                longitude,
                content,
                start_period,
                end_period,
                university_url
            } = req.body;

            // university_id를 RabbitMQ를 통해 받음
            await sendUniversityURL('SendUniversityID', university_url);
            const university_id_obj = await receiveUniversityDataAsync('RecvUniversityID');
            const university_id = university_id_obj.university_id; // 객체에서 실제 ID 추출

            const partner = new Partner();
            const response = await partner.uploadPartnerStore(
                partner_name,
                content,
                start_period,
                end_period,
                address,
                university_id,
                latitude,
                longitude
            );

            return res.json(response);
        } catch (err) {
            console.error('uploadPartnerStore error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    DeletePartnerStore: async (req, res) => {
        const partner = new Partner();
        const response = await partner.DeletePartnerStore(req.params.partner_id);
        return res.json(response);
    }
};

const university = {
    getUniversityName: async (req, res) => {
    try {
        const university_url = req.body.university_url;
        
        // 송신할 큐 이름
        const sendQueue = 'SendUniversityName';
        const recvQueue = 'RecvUniversityName';

        // university_url 전송
        await sendUniversityURL(sendQueue, university_url);

        // 수신 및 응답
        await receiveUniversityData(recvQueue, (data) => {
        return res.json({ university_name: data.university_name });
        });
        
    } catch (err) {
        console.error('getUniversityName error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    }
}

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

module.exports = {
    output,
    partner,
    university
};
