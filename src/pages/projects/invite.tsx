import React, {Component} from 'react';
import Router from 'next/router'
import Layout from '@/components/layout'
import LibCookie from "@/lib/LibCookie";
import LoadingBox from '@/components/LoadingBox'

import { gql } from "@apollo/client";
import client from '@/apollo-client'

interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
  inveiteCode: string,
  projectName:  string,
}
interface IProps {
  csrf: any,
  user_id: string,
  projectId: string,
}

export default class Page extends Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', userId: '', button_display: false,
      inveiteCode: '', projectName: '',
    }
console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
//console.log( "user_id=" , uid)
    if(uid === null){
      Router.push('/auth/login');
    }else{
      const dataProject = await client.query({
        query: gql`
        query {
          project(id: ${this.props.projectId}) {
            id
            name
            inveiteCode
            createdAt
          }                                
        }
        `,
        fetchPolicy: "network-only"
      });
      let project = dataProject.data.project;      
//console.log(project);
      this.setState({
        userId: uid, button_display: true, inveiteCode: project.inveiteCode,
        projectName: project.name,
      });    
    }
  }   
  async onClick(){
    try{
      console.log("#onClick");
      const invite = document.querySelector<HTMLInputElement>('#invite');
      console.log(invite.value);
      if(invite.value !== this.state.inveiteCode){
        alert("Error, invite code invalid");
      }else{
        const resMember = await client.mutate({
          mutation:gql`
          mutation {
            addProjectMember(projectId: ${this.props.projectId},
               firebaseUid: "${this.state.userId}"){
              id
            }          
          }                    
        `
        });
console.log(resMember); 
        location.href = `/tasks?project=${this.props.projectId}`;
      }
    } catch (e) {
      console.error(e);
      alert("Error, invite save");
    }    
  }
  render(){
//console.log(this.state);
    return (
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}      
      <div className="container">
        <h1>Invite</h1>
        <p>Invete (招待コード) を、入力下さい。</p>
        <hr className="my-1" />
        <h3>Project : {this.state.projectName}</h3>
        <hr className="my-1" />
        <div className="col-md-6 form-group">
          <label>InviteCode:</label>
          <input type="text" name="invite" id="invite" className="form-control"
          />
          <hr />
          {this.state.button_display ? (
            <div className="form-group my-2">
              <button onClick={() => this.onClick()} className="btn btn-primary">Save
              </button>
            </div>                
          ): (<div></div>)
          }          
        </div>      
      </div>
    </Layout>
    )
  }

}
//
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.project;
console.log(id);
  return {
    props: { projectId: id },
  }
}
//
/*
export default function Home() {
  const onClick = async function(){
  }
}*/
