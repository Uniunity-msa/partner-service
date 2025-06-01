"use strict"

const express =require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");


// partner 라우터
router.get("/partner/:university_url",ctrl.output.partner);
router.post("/partner/getPartner",ctrl.partner.getPartner);
router.post("/partner/getUniversityLocation",ctrl.partner.getUniversityLocation);
router.post("/partner/uploadPartner",ctrl.partner.uploadPartnerStore);

router.get("/partner/partnerUpdate/:university_url",ctrl.output.partnerForm);
router.get("/partner/deleterStore/:partner_id",ctrl.partner.DeletePartnerStore);

router.get("/retailer/:university_url",ctrl.output.retailer);

router.post("/partner/getUniversityName", ctrl.university.getUniversityName);

module.exports=router;



