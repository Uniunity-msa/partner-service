"use strict";

const { resolve } = require("path");
const { pool } = require("../config/db");

class PartnerStorage{
    // university_id로 해당 대학의 제휴 가게 모두 뽑아내기
    static async getPartnerStores(university_id){ 
        return new Promise(async(resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("SELECT * FROM Partner WHERE university_id=?;",[university_id],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        reject(err);
                    }
                    resolve(rows);
                })
            });
            
        })    
    }
    // 제휴가게 등록하기
    static async uploadPartnerStore(partner_name, content, start_period, end_period, address, university_id, latitude, longitude){
        return new Promise(async(resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("INSERT into Partner (partner_name, content, start_period, end_period, address, university_id, latitude, longitude) values (?,?,?,?,?,?,?,?);",[partner_name, content, start_period, end_period, address, university_id, latitude, longitude],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        reject(err);
                    }
                    console.log("PartnerStorage.js uploadPartnerStore 실행");
                    resolve(rows);
                })
            });
        })    
    }
    // 제휴가게 삭제하기
    static async DeletePartnerStore(partner_id){
        return new Promise(async(resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("DELETE FROM Partner WHERE partner_id=?;",[partner_id],function(err,rows){
                    connection.release()
                    if(err){
                        console.error('Query 오류',err);
                        reject(err);
                    }
                    resolve(rows);
                })
            });
        })    
    }
};

module.exports = PartnerStorage;
