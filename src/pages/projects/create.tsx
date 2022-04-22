import Link from 'next/link';
import Router from 'next/router'
import flash from 'next-flash';
import React, {Component} from 'react';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
}
interface IProps {
  csrf: any,
  user_id: string,
}
//
export default class TodoCreate extends Component<IProps, IState> {
  static async getInitialProps(ctx) {
//console.log(json)
    return {}
  }  
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', userId: '', button_display: false
    }
    this.handleClick = this.handleClick.bind(this);
//console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
//console.log( "user_id=" , uid)
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/auth/login');
    }else{
  //console.log(data.data.getToken);
      this.setState({
        userId: uid, button_display: true,
      });    
    }
  }   
  handleClick(){
    this.addItem()
  } 
  async addItem(){
    try {
      const name = document.querySelector<HTMLInputElement>('#name');
console.log(name.value);
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addProject(name: "${name.value}", firebaseUid:  "${this.state.userId}"){
            id
          }
        }                    
      `
      });
      console.log(result);
      let projectId = "";
      if(result.data.addProject.id === 'undefined'){
        throw new Error('Error , save project');
      }
      projectId = result.data.addProject.id;      
console.log(projectId);
      const resMember = await client.mutate({
        mutation:gql`
        mutation {
          addProjectMember(projectId: ${projectId}, firebaseUid: "${this.state.userId}"){
            id
          }          
        }                    
      `
      });
      console.log(resMember);

/*
*/
      Router.push('/projects');
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  } 
  render() {
console.log(this.state);
    return (
    <Layout>
      <main>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}
        <div className="container">
          <Link href="/projects">
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h1>Project - Create</h1>
          <div className="col-md-6 form-group">
            <label>Name:</label>
            <input type="text" name="name" id="name" className="form-control"
            />
          </div>
          {this.state.button_display ? (
            <div className="form-group my-2">
              <button className="btn btn-primary" onClick={this.handleClick}>Create
              </button>
            </div>                
          ): (<div></div>)
          }          
          <hr />
          {/*
          */}
        </div>
      </main>
    </Layout>
    )    
  } 
}

