"use strict";

const PartnerStorage = require("./PartnerStorage");
const http = require("http");

class Partner{
    // university
    async getUniversityID(university_url){
        try{
            const response = await PartnerStorage.getUniversityID(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getUniversityName(university_url){
        try{
            const response = await PartnerStorage.getUniversityName(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }

    async getUniversityLocation(university_id){
        try{
            const response = await PartnerStorage.getUniversityLocation(university_id);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getPartnerStores(university_id){
        try{
            const response = await PartnerStorage.getPartnerStores(university_id);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async showUniversity(university_url){
        try{
            const response = await PartnerStorage.getUniversity(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getUniversityID_name(university_name){
        try{
            const response = await PartnerStorage.getUniversityID_name(university_name);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async uploadPartnerStore(partner_name, content, start_period, end_period, address, university_id, latitude, longitude){
        try{
            const response = await PartnerStorage.uploadPartnerStore(partner_name, content, start_period, end_period, address, university_id, latitude, longitude);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async DeletePartnerStore(partner_id){
        try{
            const response = await PartnerStorage.DeletePartnerStore(partner_id);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }

};


module.exports = Partner;
