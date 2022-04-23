import { gql } from "@apollo/client";
import client from '@/apollo-client'
import axios from 'axios';
const ExcelJS = require('exceljs');

import LibCommon from '@/lib/LibCommon'

const LibTask = {
  validProjectMember: async function(projectId: number, firebaseUid: string){
    try{
      let ret = false;
      const data = await client.query({
        query: gql`
        query {
          countProjectMembers(projectId: ${projectId},
             firebaseUid: "${firebaseUid}")                                
        }
        `,
        fetchPolicy: "network-only"
      });
      let count = data.data.countProjectMembers;
console.log(count);
      if(count > 0){
        ret = true;
      }      
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, validProjectMember: ' + e);
    }
  },
  // exportRowXlxs : １行を出力する
  exportRowXlxs: async function(items: any, startRow: number, worksheet: any,
    status: string){
    try{
      let iCount = 0;
      let row = worksheet.getRow(1);
      // None
      for (const item of items) {
        let pos = startRow + iCount;
        row = worksheet.getRow(pos);
        let complete = LibCommon.converDateString(item.complete);
        let createdAt = LibCommon.converDateString(item.createdAt);
        row.getCell(1).value = item.id;
        row.getCell(2).value = status;
        row.getCell(3).value = complete;
        row.getCell(4).value = createdAt;
        row.getCell(5).value = item.title;
        iCount += 1;
      } 
      return iCount;     
    } catch (e) {
      console.error(e);
      throw new Error('error, exportRowXlxs: ' + e);
    }
  },
  // exportXlsx
  exportXlsx: async function(taskData: any){
    try{
console.log(taskData.itemsNone);
      const res = await axios.get("/task_temp.xlsx", { responseType: "arraybuffer" });
      const data = new Uint8Array(res.data);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const worksheet = workbook.getWorksheet('sheet1');
      worksheet.pageSetup = {orientation:'portrait'};
      const startRowNone = 4;
      let startRow = startRowNone;
      let iCount = 0;      
      let row = worksheet.getRow(1);
      const borderObj = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      };
      // None
      iCount = await this.exportRowXlxs(taskData.itemsNone, startRow, worksheet, "None");
      startRow = iCount + startRow;  
//console.log("iCount=", iCount);  
//console.log(startRow);
      iCount = await this.exportRowXlxs(taskData.itemsWorking, startRow, worksheet, "Working");  
      //working
      startRow = iCount + startRow;  
//console.log("iCount=", iCount);  
//console.log(startRow);       
      //itemsComplete
      iCount = await this.exportRowXlxs(taskData.itemsComplete, startRow, worksheet, "Complete");  
      //
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          // セルの枠線を設定
          if (rowNumber >= startRowNone) {
            cell.border = borderObj;
          }
        });
        row.commit();
      });     
      const uint8Array = await workbook.xlsx.writeBuffer();
  //console.log(uint8Array);
      const blob = new Blob([uint8Array], {type: 'application/octet-binary'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks.xlsx`;
      a.click();
      a.remove()       
      /*
      */
    } catch (e) {
      console.error(e);
      throw new Error('error, exportXlsx: ' + e);
    }
  },  
}
export default LibTask
