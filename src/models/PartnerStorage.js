"use strict";

const { resolve } = require("path");
const { pool } = require("../config/db");

class PartnerStorage{
    // university_id로 해당 대학의 제휴 가게 모두 뽑아내기
    static async getPartnerStores(university_id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Partner WHERE university_id = ?;";
      pool.query(sql, [university_id], (err, rows) => {
        if (err) {
          console.error("Query 오류 (getPartnerStores):", err);
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }
    // 제휴가게 등록하기
    static async uploadPartnerStore(
    partner_name,
    content,
    start_period,
    end_period,
    address,
    university_id,
    latitude,
    longitude
  ) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO Partner (partner_name, content, start_period, end_period, address, university_id, latitude, longitude) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
      const params = [
        partner_name,
        content,
        start_period,
        end_period,
        address,
        university_id,
        latitude,
        longitude,
      ];
      pool.query(sql, params, (err, result) => {
        if (err) {
          console.error("Query 오류 (uploadPartnerStore):", err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
    // 제휴가게 삭제하기
    static async deletePartnerStore(partner_id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM Partner WHERE partner_id = ?;";
      pool.query(sql, [partner_id], (err, result) => {
        if (err) {
          console.error("Query 오류 (deletePartnerStore):", err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
};

module.exports = PartnerStorage;
