import { gql } from "@apollo/client";
import client from '@/apollo-client'
//import axios from 'axios';

//import LibCommon from '@/lib/LibCommon'

const LibTask = {
  /**
  * validProjectMember
  * @param projectId: number
  * @param firebaseUid: string
  * 
  * @return
  */   
  validProjectMember: async function(projectId: number, firebaseUid: string): Promise<any>
  {
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
      throw new Error('error, validProjectMember: ');
    }
  }, 
}
export default LibTask
