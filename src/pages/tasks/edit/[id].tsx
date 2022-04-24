//import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router'
import React from 'react'
import flash from 'next-flash';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import LibCommon from "@/lib/LibCommon";
import LibGraphql from "@/lib/LibGraphql";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  title: string,
  content: string,
  complete: string,
  status: string,
  _token: string,
  userId: string,
  projectId: number,
  button_display: boolean,
  statusItems: any[],
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  complete_type: number,
}
const statusItems = ['none', 'working', 'complete'];
//
export default class TaskEdit extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.state = {
      projectId: 0,
      title: '', 
      content: '',
      complete: '',
      status: 'none',
      statusItems: [],
      _token : '',
      userId: '', button_display: false,
    }
console.log(this.props )
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log( "user_id=" , uid)    
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/auth/login');
    }else{
      const data = await client.query({
        query: gql`
        query {
          task(id: ${this.props.id}) {
            id
            projectId
            status
            title
            content
            complete
            createdAt
          }                               
        }
        ` ,
        fetchPolicy: "network-only"
      });
      const task = data.data.task;
//console.log(task);
      const date = LibCommon.converDateString(task.complete);
//console.log(date);
      const complete = document.querySelector<HTMLInputElement>('#complete');
      complete.value = date;
      this.setState({
        status: task.status,
        statusItems: statusItems,
        projectId: task.projectId,
        title: task.title , content: task.content, complete: task.complete,
        userId: uid, button_display: true,
      });      
    }
  }  
  async handleClickDelete(){
    console.log("#deete-id:" , this.props.id)
    try {
      const result = await client.mutate({
        mutation:  gql`
        mutation {
          deleteTask(id: ${this.props.id}){
            id
          }
        }
      ` 
      });
console.log(result);
/*
      if(result.data.deleteBook.id === 'undefined'){
        throw new Error('Error , deleteTask');
      }
*/
      Router.push(`/tasks?project=${this.state.projectId}`);      
    } catch (error) {
      console.error(error);
    }     
  } 
  async handleClick(){
  console.log("#-handleClick")
    await this.update_item()
  }     
  async update_item(){
    try {
      console.log("#update_item-id:" , this.props.id);
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = content.value;
      contentValue = LibGraphql.replaceMutaionString(contentValue);
      const complete = document.querySelector<HTMLInputElement>('#complete');
      const result = await client.mutate({
        mutation: gql`
        mutation {
          updateTask(id: ${this.props.id}, title: "${title.value}", content: "${contentValue}",
           complete: "${complete.value}", status: "${this.state.status}"){
            id
          }                    
        }                    
      `
      });
console.log(result);
/*
      if(result.data.updateBook.id === 'undefined'){
        throw new Error('Error , updateBook');
      }
*/
      Router.push(`/tasks?project=${this.state.projectId}`);
    } catch (error) {
      console.error(error);
      alert("Error, save item");
    }     
  }
  handleChangeRadio(e){
    this.setState({status: e.target.value})
  }
  render() {
//console.log(this.state);
    let content = this.state.content;
    content = LibGraphql.getTagString(content);
//console.log(content);
    return (
      <Layout>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )
        }        
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Link href={`/tasks?project=${this.state.projectId}`}>
                <a className="btn btn-outline-primary mt-2">Back</a>
              </Link>              
            </div>
            <div className="col-md-4"><h3 className="my-0">Task - Edit</h3>
              ID : {this.props.id}
            </div>
            <div className="col-md-4">
            {this.state.button_display ? (
              <div>
                <div className="form-group mt-2">
                  <button className="btn btn-primary" onClick={this.handleClick}>Save
                  </button>
                </div>
              </div>
              ): ""
            }          
            </div>
          </div>
          {/*
          <hr className="my-1" />
          ID : {this.props.id}
          */}
          <hr className="my-1" />
          <div className="col-md-9 form-group">
            <label>Title:</label>
            <input type="text" id="title" className="form-control"
            defaultValue={this.state.title}
             />
          </div>
          {/*
          <hr className="my-1" />
          */}
          <label>Status:</label><br />
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
          <hr className="my-1" />          
          <div className="col-md-4 form-group">
            <label>Scheduled Complete:</label>
            <input type="date" name="complete" id="complete" required={true} className="form-control"
            ></input>
          </div>
          {/*
          <hr className="my-1" />         
          */} 
          <div className="form-group">
            <label>Content:</label>
            <div className="col-sm-12">
              <textarea name="content" id="content" className="form-control"
               rows={10} defaultValue={content} placeholder="markdown input, please"
               ></textarea>
            </div>
          </div>          
          {this.state.button_display ? (
            <div>
              {/*
              <div className="form-group mt-2">
                <button className="btn btn-primary" onClick={this.handleClick}>Save
                </button>
              </div>
              */}
              <hr className="my-2" /> 
              <div className="form-group">
                <button className="btn btn-danger" onClick={this.handleClickDelete}>Delete
                </button>
              </div>
            </div>
            ): ""
          }          
          <hr className="my-1" />
        </div>
      </Layout>
    );
  }
}
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
console.log(id);
  return {
    props: { id: id },
  }
}
