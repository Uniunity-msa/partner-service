"use strict"

const Partner = require("../models/Partner");
const bcrypt = require('bcrypt');
const { sendUniversityURL, receiveUniversityData, generateCorrelationId } = require('../rabbit/rabbitMQ');

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
    getUniversityLocation: async (req, res) => {
        try {
            console.log("getUniversityLocation 실행: 지도 중심값 설정");
            const university_url = req.body.university_url;
            const correlationId = generateCorrelationId();

            // RabbitMQ로 university_location 요청 및 수신
            await sendUniversityURL(university_url, 'SendUniversityLocation', correlationId);
            const university_location = await receiveUniversityData('RecvPartnerUniversityLocation', correlationId);
            console.log("getUniversityLocation 실행: getUniversityLocation 받아오기 => ", university_location.latitude, university_location.longitude);
            return res.json(university_location);

        } catch (err) {
            console.error('getUniversityLocation error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getPartner: async (req, res) => {
        try {
            const university_url = req.body.university_url;
            const correlationId = generateCorrelationId();

            // 통신으로 university_id와 university_location 받아오기
            await sendUniversityURL(university_url, 'SendUniversityID', correlationId);
            const university_id = await receiveUniversityData('RecvPartnerUniversityID', correlationId);
            console.log("getPartner 실행: university_id 받아오기 => ", university_id.university_id);

            await sendUniversityURL(university_url, 'SendUniversityLocation', correlationId);
            const university_location = await receiveUniversityData('RecvPartnerUniversityLocation', correlationId);
            console.log("getPartner실행: 지도 중심값 설정 => ", university_location.latitude, university_location.longitude);
            
            const partner = new Partner();
            const university_uni = await partner.getPartnerStores(university_id.university_id); // ID 객체에서 값 꺼냄
            console.log("getPartner 실행: 제휴정보 받아오기");
            // 응답 객체 구성
            const obj = [];
            obj.push({
                latitudeUni: university_location.latitude,
                longitudeUni: university_location.longitude,
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
    uploadPartnerStore: async (req, res) => {
        try {        
            const university_url = req.body.university_url;
            const partner_name = req.body.partner_name,
                address = req.body.address,
                latitude = req.body.latitude,
                longitude = req.body.longitude,
                content = req.body.content,
                start_period = req.body.start_period,
                end_period = req.body.end_period;
            const correlationId = generateCorrelationId();

            // university_id를 RabbitMQ를 통해 받음
            await sendUniversityURL(university_url, 'SendUniversityID', correlationId);
            const university_data = await receiveUniversityData('RecvPartnerUniversityID', correlationId);
            const university_id = university_data.university_id;
            console.log("uploadPartnerStore 실행: university_id 받아오기 => ", university_id);

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
            console.log("uploadPartnerStore 실행: 제휴정보 등록");
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
            const correlationId = generateCorrelationId();

            await sendUniversityURL(university_url, 'SendUniversityName', correlationId);
            const data = await receiveUniversityData('RecvPartnerUniversityName', correlationId)
            console.log("getUniversityName 실행: 대학이름 받아오기 => ", data.university_name);

            return res.json(data.university_name);
    }catch (err) {
            console.error('getUniversityName error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    output,
    partner,
    university
};
