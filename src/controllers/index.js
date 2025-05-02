"use strict"

const express =require("express");
const router = express.Router();
const cors = require('cors');



const ctrl = require("./home.ctrl");

router.get("/",ctrl.output.home);



//학교 라우터
router.get("/showUniversityNameList/:university_name",ctrl.output.showUniversityNameList);
router.get("/showUniversityNameList",ctrl.output.showUniversityNameList);

// partner 라우터
router.get("/partner/:university_url",ctrl.output.partner);
router.get("/getUniversityID/:university_url",ctrl.partner.getUniversityID);
router.post("/getPartner",ctrl.partner.getPartner);
router.post("/getPartnerUni",ctrl.partner.getPartnerUni);
router.post("/getUniversityLocation",ctrl.partner.getUniversityLocation);
router.post("/uploadPartner",ctrl.partner.uploadPartnerStore);

router.get("/partnerUpdate/:university_url",ctrl.output.partnerForm);
router.get("/deleterStore/:storeID",ctrl.partner.DeletePartnerStore);

// retailer 라우터
router.get("/retailer/:university_url",ctrl.retailer.retailer);
router.get("/retailer/:university_url/:kind", ctrl.retailer.retailerKind);


module.exports=router;