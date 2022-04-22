import {useState, useEffect}  from 'react';
import React from 'react';
//import axios from 'axios'

import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import ReactPaginate from 'react-paginate';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
import LibCommon from '@/lib/LibCommon'

const perPage = 100;
interface IProps {
  items: Array<object>,
  history:string[],
}
interface IState {
  items: any[],
  items_all: any[],
  categoryItems: any[],
  category: string,
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
  userId: string,
  type_complete: number,
}
//
export default class TodoIndex extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
//console.log(items);  
    return {
      items: [],
    }
  }
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false, userId: '', type_complete: 0,
     };
//console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
    }
    //
    const data = await client.query({
      query: gql`
      query {
        projects(firebaseUid: "${uid}") {
          id
          name
          createdAt    
        }                
      }
      `,
      fetchPolicy: "network-only"
    });
    let items = data.data.projects;
    const items_all = items;
//    items = items_all.filter(item => (item.complete === 0));
//console.log(items);
    LibPagenate.set_per_page(perPage);
    const n = LibPagenate.getMaxPage(items.length);
    const d = LibPagenate.getPageStart(0);
    this.setState({
      items: items, items_all: items_all, button_display: true, pageCount: n,
      userId: uid,  
    })  
  }    
  handlePageClick (data: any) {
    console.log('onPageChange', data);
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);
    const d = LibPagenate.getPageStart(selected);
    const items = this.state.items_all.filter(item => 
      (item.complete === this.state.type_complete)
    );
//console.log(d);
    this.setState({
      offset: offset, 
      items: items.slice(d.start, d.end) 
    });
  }    
  render(){
    const currentPage = Math.round(this.state.offset / perPage);
    const data = this.state.items;
//console.log(this.state);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-2 mb-4">
        <h3>Project</h3>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6">
            <Link href="/projects/create">
              <a><button className="btn btn-primary mt-2">Create</button>
              </a>
            </Link>
          </div>
          <div className="col-md-6  text-end">
          </div>
        </div>
        <hr className="my-1" />
        {/* data */}      
        {data.map((item: any ,index: number) => {
          let date = LibCommon.converDatetimeString(item.createdAt);
  //console.log(item.values.title);  created_at
          return (
            <IndexRow key={index} id={item.id} name={item.name} date={date} />
          )
        })}      
        <hr />
      </div>
      <style>{`
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 2.4rem; }      
      `}</style>
    </Layout>
    );
  }
}
