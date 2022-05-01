import Link from 'next/link';
import Router from 'next/router'
import flash from 'next-flash';
import React, {Component} from 'react';
import moment from 'moment';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
//
const statusItems = ['none', 'working', 'complete'];

interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
  statusItems: any[],
  status : string,
}
interface IProps {
  csrf: any,
  user_id: string,
  projectId: string,
}
//
export default class TaskCreate extends Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', userId: '', button_display: false,
      statusItems: [], status: 'none',
    }
    this.handleClick = this.handleClick.bind(this);
//console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log( "user_id=" , uid)
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/auth/login');
    }else{
  //console.log(data.data.getToken);
      this.setState({
        userId: uid, button_display: true, statusItems: statusItems,
      });    
      const dt =  moment(new Date() );
//console.log(dt.format("YYYY-MM-DD"))
      const complete = document.querySelector<HTMLInputElement>('#complete');
      complete.value = dt.format("YYYY-MM-DD");
    }
  }   
  handleClick(){
    this.addItem()
  } 
  async addItem(){
    try {
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = content.value;
      contentValue = contentValue.replace(/\r?\n/g, '<br />');  //win
      contentValue = contentValue.replace(/\n/g, '<br />');
      contentValue = contentValue.replace(/\"/g, '<doubleQuarts>');
      const complete = document.querySelector<HTMLInputElement>('#complete');
//console.log(title.value, this.props.projectId);
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addTask(projectId: ${this.props.projectId}, title: "${title.value}",
            content: "${contentValue}", status: "${this.state.status}", 
            complete: "${complete.value}", userId:"", firebaseUid:"${this.state.userId}"){
            id
          }
        }                    
      `
      });
console.log(result);
      Router.push(`/tasks?project=${this.props.projectId}`);
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  }
  handleChangeRadio(e){
    this.setState({status: e.target.value})
  }   
  render() {
//console.log(this.state);
    return (
    <Layout>
      <main>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}
        {/* container bg-light styles.container */}
        <div className="container bg-light">
          <div className="row">
            <div className="col-md-4">
              <Link href={`/tasks?project=${this.props.projectId}`}>
              <a className="btn btn-outline-primary mt-2">Back</a></Link>
            </div>
            <div className="col-md-4"><h3>Tasks - Create</h3>
            </div>
            <div className="col-md-4 text-center">
            {this.state.button_display ? (
              <div className="form-group my-2">
                <button className="btn btn-primary" onClick={this.handleClick}>Create
                </button>
              </div>                
            ): (<div></div>)
            }          
            </div>
          </div>
          <hr className="mt-2 mb-2" />
          {/* styles.label  fs-7  text-success */}
          <div className="col-md-9 form-group">
            <label className="fw-bold ">Title:</label>
            <input type="text" name="title" id="title" className="form-control"
            />
          </div>
          <div className="mt-1">
            <label className="fw-bold">Status:</label><br />
            {this.state.statusItems.map((item ,index) => {
    //console.log(item);
              return (
                <span key={index}>
                  <input className="form-check-input mx-2" type="radio" name="status"
                  value={item} defaultChecked={this.state.status === item}
                  onChange={this.handleChangeRadio.bind(this)} 
                  />
                  <label className="form-check-label">
                    {item}
                  </label>
                </span>
              );
            })
            }
          </div>
          <hr className="my-1" />          
          <div className="col-md-4 form-group mt-2">
            <label className="fw-bold">Scheduled Complete:</label>
            <input type="date" name="complete" id="complete" required={true} className="form-control"
            ></input>
          </div>
          <div className="form-group mt-2">
            <label className="fw-bold">Content:</label>
            <div className="col-sm-12">
              <textarea name="content" id="content" className="form-control"
               rows={10} placeholder="markdown input, please"></textarea>
            </div>
          </div>          
        </div>
      </main>
    </Layout>
    )    
  } 
}

export const getServerSideProps = async (ctx) => {
  const id = ctx.query.project;
console.log(id);
  return {
    props: { projectId: id },
  }
}