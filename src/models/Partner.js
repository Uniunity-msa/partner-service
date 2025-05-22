"use strict";

const PartnerStorage = require("./PartnerStorage");
const http = require("http");

class Partner{
    async getPartnerStores(university_id){
        try{
            const response = await PartnerStorage.getPartnerStores(university_id);
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
