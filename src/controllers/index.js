"use strict"

const express =require("express");
const router = express.Router();
const cors = require('cors');



const ctrl = require("./home.ctrl");

router.get("/",ctrl.output.home);


// council 라우터
router.get("/council/:universityname",ctrl.result.council);
router.get("/post/:universityname/:category",ctrl.output.post);
router.post("/getUniversityName", ctrl.result.getUniversityName);
router.post("/getCardNewsImageUrl", ctrl.result.getCardNewsImageUrl);



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


//post 라우터
router.get("/postAll/:university_url",ctrl.post.postAll); //전체게시글 불러오기 API
router.get("/postform/:university_url",ctrl.output.postform);
router.get("/postviewer/:post_id",ctrl.output.postviewer);
router.get("postform/modify",ctrl.output.postformModify);


module.exports=router;