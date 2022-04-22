import React, {Component} from 'react';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '../components/layout'
import LibCookie from '@/lib/LibCookie'
import LibTodo from '@/lib/LibTodo'

interface IProps {
  history:string[],
}
interface IState {
  userId: string,
}
//
export default class OptionPage extends React.Component<IProps, IState>{
  static async getInitialProps(ctx) {
//console.log(json)
    return {}
  }   
  constructor(props){
    super(props)
    this.state = {
        userId: ''
     };
//console.log(props);   
  }  
  componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
    }else{
      this.setState({userId: uid});
    }    
    const self = this;
    window.addEventListener("load", function() {
      window.document.getElementById("file1").addEventListener("change", function() {
          //console.log("#-change")
        self.change_proc()
      });
    });        
  }
  change_proc(){
    console.log("#-change_proc")
    const self = this
    const file1: any = window.document.getElementById('file1');
    const files = file1.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      console.log("i: " + i );                
      console.log("Name: " + file.name);
      console.log("Size: " + file.size);
      console.log("Type: " + file.type);
      console.log("Date: " + file.lastModified);
      console.log("Date: " + file.lastModifiedDate);
      
      const reader = new FileReader();
      reader.onload = async function(evt) {
        console.log("State: " + evt.target.readyState);
        const result: any = evt.target.result;
        const dat = JSON.parse(result || '[]')
// console.log( dat )
        await self.add_item(dat)
      };
      reader.onerror = function(evt) {
        console.log(evt.target.error.name);
        console.error(evt.target.error);
      };
      reader.readAsText(file, "utf-8");             
    }    
  }
  async add_item(items: any){
    try{
console.log(this.state.userId);
//      let count = 0;
      for (let item of items) {
//        count += 1;
        console.log(item);
        let content =  LibTodo.replaceMutaionString(item.content)
//console.log(content);
        const result = await client.mutate({
          mutation:gql`
          mutation {
            addTodo(title: "${item.title}", content: "${content}", complete: ${item.complete},
             userId:"${this.state.userId}"){
              id
            }          
          }                    
        `
        });
  console.log(result);   
  /*
        if(count >= 20){
          return;
        }
  */
      }
      alert("Complete add");
    } catch (e) {
      console.error(e);
      alert("error, Import");
    }
  }  
  render(){
console.log(this.state);
    return (
    <Layout>
      <div className="container">
        <h1>Option</h1>
        <hr className="my-1"/>
        <h3>Todo Json Import</h3>
        <div>
          <input type="file" id="file1" className="btn btn-outline-primary" />
        </div> 
        <hr className="my-1"/>     
      </div>
    </Layout>
    )
  }
}