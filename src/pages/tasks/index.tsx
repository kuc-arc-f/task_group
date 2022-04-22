import {useState, useEffect}  from 'react';
import React from 'react';

import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
import LibCommon from '@/lib/LibCommon'
import LibTask from '@/lib/LibTask'

const perPage = 100;
interface IProps {
  items: Array<object>,
  history:string[],
  projectId: string,
}
interface IState {
  items: any[],
  items_all: any[],
  itemsNone: any[],
  itemsWorking: any[],
  itemsComplete: any[],
//  category: string,
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
  userId: string,
  type_complete: number,
  project: any,
}
//
export default class TaskIndex extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      itemsNone:[], itemsWorking:[], itemsComplete:[],
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, 
      button_display: false, userId: '', type_complete: 0,
      project: {}
     };
console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
    }
    //valid-member
    const validMember = await LibTask.validProjectMember(
      Number(this.props.projectId), uid
    );
console.log(validMember);
    if(validMember === false){
//      location.href = '/projects/invite';
      location.href = `/projects/invite?project=${this.props.projectId}`;
    }else{
      const data = await client.query({
        query: gql`
        query {
          tasks(projectId: ${this.props.projectId}) {
            id
            title
            status
            complete
            createdAt    
          }                        
        }
        `,
        fetchPolicy: "network-only"
      });
      let items = data.data.tasks;
      // project
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
      const items_all = items;
      //  none/working/complete
      const itemsNone = items.filter(item => (item.status === 'none') );
      const itemsWorking = items.filter(item => (item.status === 'working') );
      const itemsComplete = items.filter(item => (item.status === 'complete') );
  //console.log(itemsWorking);
      LibPagenate.set_per_page(perPage);
      const n = LibPagenate.getMaxPage(items.length);
      const d = LibPagenate.getPageStart(0);
      this.setState({
        itemsNone: itemsNone, itemsWorking:itemsWorking, itemsComplete: itemsComplete,
        items: items, items_all: items_all, button_display: true, pageCount: n,
        userId: uid,  project: project, 
      })  
    }
  }    
  render(){
    const data = this.state.items;
    const project = this.state.project;
console.log(project);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-1 mb-4 bg-white">
        <div className="row">
          <div className="col-md-8"><h3>{project.name}</h3>
          </div>
          <div className="col-md-4 text-center">
            <Link href={`/tasks/create?project=${this.props.projectId}`}>
              <a><button className="btn btn-primary mt-0">Create</button>
              </a>
            </Link>
            <span className="mx-2">Invite: {project.inveiteCode}</span>
          </div>
        </div>
        <hr className="my-1" />
        {/* 2-col Status:*/}
        <div className="row">
          <div className="col-md-4 text-center">None</div>
          <div className="col-md-4 text-center">Working</div>
          <div className="col-md-4 text-center">Complete</div>
        </div>        
        <div className="row">
          <div className="col-md-4">
          {this.state.itemsNone.map((item: any ,index: number) => {
            let date = LibCommon.converDateString(item.complete);
    //console.log(item.values.title);  created_at
            return (
              <IndexRow key={index} id={item.id} title={item.title} date={date}
              status="none" />
            )
          })}      
          </div>
          <div className="col-md-4">
          {this.state.itemsWorking.map((item: any ,index: number) => {
            let date = LibCommon.converDateString(item.complete);
    //console.log(item.values.title);  created_at
            return (
              <IndexRow key={index} id={item.id} title={item.title} date={date}
              status="working" />
            )
          })}      
          </div>
          <div className="col-md-4">
          {this.state.itemsComplete.map((item: any ,index: number) => {
            let date = LibCommon.converDateString(item.complete);
    //console.log(item.values.title);  created_at
            return (
              <IndexRow key={index} id={item.id} title={item.title} date={date}
               status="complete" />
            )
          })}      
          </div>
        </div>
        {/* data */}      
        <hr />
      </div>
      <style>{`
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 1.4rem; }
      .task_index_row .task_card_bg_blue{ background : #E3F2FD; }      
      .task_index_row .task_card_bg_gray{ background : #FFF3E0; }
      .task_index_row .card-body{ padding: 0.2rem; } 
      .task_index_row .task_title{ margin-bottom: 0.1rem; }  
      .task_index_row .task_date_area{ }   
      `}</style>
      {/* font-size: 2.4rem;*/}
    </Layout>
    );
  }
}
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.project;
console.log(id);
  return {
    props: { projectId: id },
  }
}